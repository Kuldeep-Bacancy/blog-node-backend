import { Router } from "express";
import verfiyJWT from "../middlewares/auth.middleware.js";
import { createComment, deleteComment } from "../controllers/comments.controller.js";

const router = Router();

router.route('/').post(verfiyJWT, createComment)
router.route('/:commentId').delete(verfiyJWT, deleteComment)

export default router