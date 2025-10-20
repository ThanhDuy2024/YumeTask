import { Router } from "express";
import { createAccount, login } from "../controllers/account.controller";
const router = Router();

router.post("/create", createAccount);

router.post("/login", login);
export default router;