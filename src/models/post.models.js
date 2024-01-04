import mongoose from "mongoose";

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
  ]
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)