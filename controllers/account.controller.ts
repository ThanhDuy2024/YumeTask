import { Request, Response } from "express";
import { Account } from "../models/Account.model";
import bcrypt from "bcryptjs"
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