import { Router } from "express";
import { createTask, deleteTask, taskList, updateTask } from "../controllers/task.controller";

const router = Router();

router.post("/create", createTask);

router.get("/list", taskList);

router.put("/update/:id", updateTask);

router.delete("/delete/:id", deleteTask);
export default router;