import { Request, Response } from "express";
import { Account } from "../models/Account.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../interfaces/account.interface";
import moment from "moment";
import { htmlCheckEmail } from "../helpers/htmlContext.hepler";
import { randomString } from "../helpers/randomString.hepler";
import { sendEmail } from "../helpers/nodemailer.hepler";
import { client } from "../config/redis.config";
export const createAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, userName } = req.body;

    // 1. Kiểm tra tài khoản tồn tại
    const check = await Account.findOne({ email });
    if (check) {
      return res.status(400).json({
        code: "error", // Sửa lại thành error cho đúng logic
        message: "Email này đã được đăng ký"
      });
    }

    // 2. Kiểm tra Rate Limit (Chống spam OTP)
    const checkEmail = await client.get(`email:${email}`);
    if (checkEmail) {
      return res.status(429).json({ // 429: Too many requests
        code: "error",
        message: "Vui lòng đợi 5 phút trước khi yêu cầu lại mã OTP"
      });
    }

    // 3. Hash Password (Dùng Async để tránh block thread)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const otp = randomString(6);
    const html: string = htmlCheckEmail(otp);
    const subject: string = `OTP XÁC THỰC EMAIL CỦA BẠN`;

    const data = { userName, email, password: hash };

    // 4. Lưu vào Redis
    // Sử dụng Promise.all để chạy song song cho nhanh
    await Promise.all([
      client.set(`otp:${otp}`, JSON.stringify(data), { EX: 300 }),
      client.set(`email:${email}`, "active", { EX: 300 })
    ]);

    // 5. GỬI EMAIL (Đây là chỗ hay gây treo)
    // Cách an toàn nhất cho Production: Dùng await và bọc try-catch riêng
    try {
      await sendEmail(email, html, subject);
    } catch (sendEmailError) {
      console.error("Lỗi hàm sendEmail:", sendEmailError);
      // Nếu không gửi được mail, nên xóa key trong redis để user bấm gửi lại được luôn
      await client.del(`email:${email}`);
      return res.status(500).json({
        code: "error",
        message: "Hệ thống không thể gửi email lúc này. Vui lòng thử lại sau."
      });
    }

    // 6. Trả về kết quả (CHỈ CHẠY KHI MỌI THỨ XONG)
    return res.status(200).json({
      code: "success",
      message: "OTP đã được gửi đi thành công"
    });

  } catch (error) {
    console.error("Global Error:", error);
    // Luôn phải có return res ở catch để tránh treo request khi có lỗi bất ngờ
    return res.status(500).json({
      code: "error",
      message: "Có lỗi xảy ra trên server"
    });
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  try {

    const { otp } = req.body
    const getData = await client.get(`otp:${otp}`);

    if(!getData) {
      return res.status(400).json({
        code: "error",
        message: "OTP của bạn bị sai!"
      })
    }

    const dataDecode = JSON.parse(getData);

    await Account.create(dataDecode);
    
    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công"
    })

  } catch (error) {
    res.status(400).json({
      code: "error",
      message: "Xác thực email thất bại"
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await Account.findOne({
      email: email
    });

    if(!checkEmail) {
      return res.status(404).json({
        code: "error",
        message: "Email hoặc mật khẩu không đúng"
      })
    }

    const verifyPassword = bcrypt.compareSync(password, String(checkEmail.password))

    if(!verifyPassword) {
      return res.status(404).json({
        code: "error",
        message: "Email hoặc mật khẩu không đúng"
      })
    }

    const token = jwt.sign({
      username: checkEmail.userName,
      email: checkEmail.email
    }, String(process.env.JWT));

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: String(process.env.ENVIROIMENT) == "dev" ? false : true,
      sameSite: "none",
     partitioned: true
    });

    res.status(200).json({
      code: "success",
      message: "Đăng nhập thành công"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      code: "error",
      message: error
    })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    
    res.status(200).json({
      code: "success",
      message: "Đăng xuất thành công"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "errror",
      message: "Đăng xuất thất bại"
    })
  }
}

export const profileUser = async (req: users, res: Response) => {
  try {
    const { id, userName, email, createdAt, updatedAt, } = req.users
    const createdAtFormat = moment(createdAt).format("DD/MM/YYYY HH:mm");
    const updatedAtFormat = moment(updatedAt).format("DD/MM/YYYY HH:mm");

    const userData:any = {
      id: id,
      userName: userName,
      email: email,
      createdAt: createdAtFormat,
      updatedAt: updatedAtFormat
    }

    res.status(200).json({
      data: userData
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: ""
    })
  }
}