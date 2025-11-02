import { Response } from "express";
import { users } from "../interfaces/account.interface";
import { Task } from "../models/Task.model";
import moment from "moment";
import { statusArray } from "../config/variable.config";

export const createTask = async (req: users, res: Response ) => {
  try {
    const task: any = req.body;

    task.userId = req.users.id;

    if(!statusArray.includes(task.status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ!"
      })
    }
    
    await Task.create(task);

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

export const taskList = async (req: users, res: Response) => {
  try {

    const findTask:any = {
      userId: req.users.id,
    }

    if(statusArray.includes(String(req.query.status))) {
      findTask.status = req.query.status;
    }

    const list = await Task.find(findTask);

    const finalData:Array<object> = [];
    for (const item of list) {
      const rawData:any = {
        id: item.id,
        userId: item.userId,
        taskContent: item.taskContent,
        status: item.status,
        createdAt: "",
        updatedAt: ""
      };

      rawData.createdAt = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
      rawData.updatedAt = moment(item.updatedAt).format("HH:mm DD/MM/YYYY");

      finalData.push(rawData);
    };

    res.status(200).json({
      code: "success",
      data: finalData,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: error
    })
  }
};

export const updateTask = async (req: users, res: Response) => {
  try {
    const { id } = req.params;

    await Task.updateOne({
      _id: id,
      userId: req.users.id
    }, req.body);

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

export const deleteTask = async (req: users, res: Response) => {
  try {
    const { id } = req.params;

    await Task.deleteOne({
      _id: id,
      userId: req.users.id
    });
    
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