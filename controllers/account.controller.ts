import { Request, Response } from "express";
import { Account } from "../models/Account.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const createAccount = async (req: Request, res: Response) => {
  try {
    const check = await Account.findOne({
      email: req.body.email
    });

    if(check) {
      return res.status(400).json({
        code: "success",
        message: "Email đã tồn tại"
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    req.body.password = hash;

    await Account.create(req.body);
    res.json({
      code: "success",
      message: "Account has been create!"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error
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
      return res.status(400).json({
        code: "success",
        message: "Email chưa được đăng ký"
      })
    }

    const verifyPassword = bcrypt.compareSync(password, String(checkEmail.password))

    if(!verifyPassword) {
      return res.status(404).json({
        code: "error",
        message: "Mật khẩu của bạn không đúng"
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
      sameSite: "lax"
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