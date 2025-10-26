import { Router } from "express";
import { createAccount, login, logout } from "../controllers/account.controller";
import { createAccountValidate, loginValidate } from "../validates/account.validate";
const router = Router();

router.post("/create", createAccountValidate, createAccount);

router.post("/login", loginValidate, login);

router.get("/logout", logout);

export default router;