import ApiResponse from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js"
import mongoose from "mongoose";

const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    console.log(content, postId);

    if (!content || !postId) {
      return res.status(400).json(
        new ApiResponse(400, "Content and Post required")
      )
    }

    const createdComment = await Comment.create({
      content,
      postId: new mongoose.Types.ObjectId(postId),
      commentedBy: req.user?._id,
    })

    if (!createdComment) {
      return res.status(500).json(
        new ApiResponse(500, "Something went wrong while creating the comment!")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, 'Comment Created Successfully!', createdComment)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId

    const deletedComment = await Comment.deleteOne({ _id: commentId })

    if (!deletedComment){
      return res.status(500).json(
        new ApiResponse(500, "Something went wrong while deleting comment!")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, "Comment deleted successfully!")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

export { createComment, deleteComment }