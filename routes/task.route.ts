import { Router } from "express";
import { taskCreate } from "../controllers/task.controller";

const router = Router();

router.post("/create", taskCreate);

export default router;