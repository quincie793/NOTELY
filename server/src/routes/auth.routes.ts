import { Router } from "express";
import { register, login, logout, updatePassword } from "../controllers/auth.controller"; // 🆕 import updatePassword
import { authRequired } from "../middleware/authentication"; // 🆕 import middleware

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// 🆕 New route for updating password
router.post("/password", authRequired, updatePassword);

export default router;
