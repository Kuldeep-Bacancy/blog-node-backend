import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/users.controller.js";
import verfiyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').delete(verfiyJWT, logoutUser)

export default router