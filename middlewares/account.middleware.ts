import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Account } from "../models/Account.model";
import { users } from "../interfaces/account.interface";
export const accountMiddleware = async (req: users, res: Response, next: NextFunction) =>  {
  try {

    const token = req.cookies.token;

    if(!token) {
      return res.status(404).json({
        message: "Token hết hạn"
      })
    };

    const decode = jwt.verify(token, String(process.env.JWT)) as JwtPayload;

    const check = await Account.findOne({
      email: decode.email
    });

    if(!check) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản"
      })
    }

    req.users = check;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "error"
    })
  }
}