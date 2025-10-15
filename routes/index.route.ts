import { Router } from "express";
import accountRoute from "./account.route"
const router = Router();

router.use("/account", accountRoute);

export default router;