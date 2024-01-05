import { Router } from "express";
import { createPost, getAllPosts, getPost, deletePost } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verfiyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verfiyJWT, upload.array('images', 3), createPost)
router.route("/").get(verfiyJWT, getAllPosts)
router.route("/:postId").get(verfiyJWT, getPost)
router.route("/:postId").delete(verfiyJWT, deletePost)

export default router