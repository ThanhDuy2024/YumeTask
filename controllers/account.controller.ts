import { Request, Response } from "express";

export const createAccount = async (req: Request, res: Response) => {
  try {
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