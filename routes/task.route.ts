import { Router } from "express";
import { taskCreate, taskList } from "../controllers/task.controller";

const router = Router();

router.post("/create", taskCreate);

router.get("/list", taskList);
export default router;