import mongoose from "mongoose";


const likeAndDislikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  }
}, { timestamps: true });

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required!"]
  },
  content: {
    type: String,
    required: [true, "Content is required!"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images:[
    {
      type: String
    }
  ],
  likes: [likeAndDislikeSchema],
  dislikes: [likeAndDislikeSchema]
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)