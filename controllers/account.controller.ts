import { Request, Response } from "express";
import { Account } from "../models/Account.model";

export const createAccount = async (req: Request, res: Response) => {
  try {
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