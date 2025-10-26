import { Request, Response } from "express";

export const taskCreate = async (req: Request, res: Response ) => {
  try {
    res.status(200).json({
      code: "success",
      message: "Tạo mục nhiệm vụ thành công"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      code: "error",
      message: "Tạo nhiệm vụ thất bại"
    })
  }
}