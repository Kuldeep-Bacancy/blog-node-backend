import { Router } from "express";
import { createPost, getAllPosts } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verfiyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verfiyJWT, upload.array('images', 3), createPost)
router.route("/").get(verfiyJWT, getAllPosts)

export default router