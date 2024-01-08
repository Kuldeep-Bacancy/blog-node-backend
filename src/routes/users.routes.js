import { Router } from "express";
import { registerUser, loginUser, logoutUser, changePassword, updateUserInfo, getCurrentUserPosts } from "../controllers/users.controller.js";
import verfiyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').delete(verfiyJWT, logoutUser)
router.route('/change-password').patch(verfiyJWT, changePassword)
router.route('/update-info').patch(verfiyJWT, updateUserInfo)
router.route('/my-posts').get(verfiyJWT, getCurrentUserPosts)

export default router