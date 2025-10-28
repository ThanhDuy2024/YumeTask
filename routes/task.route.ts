import { Router } from "express";
import { createTask, taskList, updateTask } from "../controllers/task.controller";

const router = Router();

router.post("/create", createTask);

router.get("/list", taskList);

router.put("/update/:id", updateTask);
export default router;