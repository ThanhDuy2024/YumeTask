import { Router } from "express";
import { createAccount, login } from "../controllers/account.controller";
import { createAccountValidate, loginValidate } from "../validates/account.validate";
const router = Router();

router.post("/create", createAccountValidate, createAccount);

router.post("/login", loginValidate, login);
export default router;