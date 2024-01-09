import { Router } from "express";
import { registerUser, loginUser, logoutUser, changePassword, updateUserInfo, getCurrentUserPosts } from "../controllers/users.controller.js";
import verfiyJWT from "../middlewares/auth.middleware.js";
import { loginValidationRules, registerValidationRules } from "../middlewares/userValidation.middleware.js"
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route('/register').post(registerValidationRules(), validate, registerUser)
router.route('/login').post(loginValidationRules(), validate, loginUser)
router.route('/logout').delete(verfiyJWT, logoutUser)
router.route('/change-password').patch(verfiyJWT, changePassword)
router.route('/update-info').patch(verfiyJWT, updateUserInfo)
router.route('/my-posts').get(verfiyJWT, getCurrentUserPosts)

export default router