import { Request, Response } from "express";

export const createTask = async (req: Request, res: Response ) => {
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
};

export const taskList = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      code: "success",
      data: []
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: error
    })
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      code: "success",
      message: "Chỉnh sửa thành công"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "Chỉnh sửa thất bại"
    })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      code: "success",
      message: "Xóa thành công"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "Xóa thất bại"
    })
  }
}