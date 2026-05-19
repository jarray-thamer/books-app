import express from "express";
import { login, logout, userSignUp } from "../controller/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-up", userSignUp);
router.get("/login", login);
router.get("/logout", verifyToken, logout);

export default router;
