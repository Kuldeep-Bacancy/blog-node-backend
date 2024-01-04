import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.models.js"

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json(
        new ApiResponse(400, "Title and content are required!")
      )
    }

    let imageUrls = []

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      let multiplePicturePromise = req.files.map((picture) =>
        uploadOnCloudinary(picture.path)
      );
      let imageResponses = await Promise.all(multiplePicturePromise);
      imageResponses.forEach((res)=>{
        imageUrls.push(res.url)
      })
    }

    const post = await Post.create({
      title,
      content,
      user: req.user?._id,
      images: imageUrls
    })

    const createdPost = await Post.findById(post._id)

    if (!createdPost){
      return res.status(500).json(
        new ApiResponse(500, "Something went wrong while creating post!")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, "Post Created Successfully!", createdPost)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

const getAllPosts = async (req, res) => {
  const  posts = await Post.aggregate([
    {
      $lookup:{
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $project: {
        title: 1,
        content: 1,
        images: 1,
        user: { $arrayElemAt: ['$userDetails', 0] }
      }
    }
  ])
  
  return res.status(200).json(
    new ApiResponse(200, "Posts fetched Successfully!", posts)
  )
}

export { createPost, getAllPosts }