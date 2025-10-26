import { Router } from "express";
import accountRoute from "./account.route"
import taskRoute from "./task.route";
const router = Router();

router.use("/account", accountRoute);

router.use("/task", taskRoute);

export default router;