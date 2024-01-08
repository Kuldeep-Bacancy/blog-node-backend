import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.models.js"
import mongoose from "mongoose";

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
        as: 'userDetails',
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'commentedBy',
              foreignField: '_id',
              as: 'commentedBy',
              pipeline: [
                {
                  $project: {
                    password: 0,
                    refreshToken: 0
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              commentedBy: {
                $first: "$commentedBy"
              }
            }
          },
          {
            $project: {
              postId: 0
            }
          }
        ]
      }
    },
    {
      $project: {
        title: 1,
        content: 1,
        images: 1,
        user: { $arrayElemAt: ['$userDetails', 0] },
        comments: 1
      }
    }
  ])
  
  const options = {
    page: req.query?.page || 1,
    limit: req.query?.limit || 2,
  }

  const paginatedResult = await Post.aggregatePaginate(posts, options)

  return res.status(200).json(
    new ApiResponse(200, "Posts fetched Successfully!", paginatedResult)
  )
}

const getPost = async(req, res) => {
  try {
    const postId = req.params.postId

    if(!postId){
      return res.status(400).json(
        new ApiResponse(400, "Please Provide Post ID")
      )
    }

    const post = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
          pipeline:[
            {
              $project: {
                password: 0,
                refreshToken: 0
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postId',
          as: 'comments',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'commentedBy',
                foreignField: '_id',
                as: 'commentedBy',
                pipeline: [
                  {
                    $project: {
                      password: 0,
                      refreshToken: 0
                    }
                  }
                ]
              }
            },
            {
              $addFields: {
                commentedBy: {
                  $first: "$commentedBy"
                }
              }
            },
            {
              $project: {
                postId: 0
              }
            }
          ]
        }
      },
      {
        $project: {
          title: 1,
          content: 1,
          images: 1,
          user: { $arrayElemAt: ['$userDetails', 0] },
          comments: 1
        }
      }
    ])

    if(!post){
      return res.status(400).json(
        new ApiResponse(400, "Post not exist with this ID")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, "Post fetched successfully!", post)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

const deletePost = async(req, res) => {
  try {
    const postId = req.params.postId

    if (!postId) {
      return res.status(400).json(
        new ApiResponse(400, "Please Provide Post ID")
      )
    }

    const post = await Post.findById(postId)
    
    if(!post){
      return res.status(404).json(
        new ApiResponse(404, "Post not exist with this ID")
      )
    }
    
    if (!post.user.equals(req.user?._id)) {
      return res.status(422).json(
        new ApiResponse(422, "You are not authorized to delete this post!")
      )
    }

    const deletedPost = await post.deleteOne();

    if (!deletedPost) {
      return res.status(500).json(
        new ApiResponse(500, "Something went wrong while deleting the Post!")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, "Post Deleted Successfully!")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

const likePost = async(req, res) => {
 try {
   const postId = req.params.postId

   if (!postId) {
     return res.status(400).json(
       new ApiResponse(400, "Please Provide Post ID")
     )
   }

   // check already liked post
   const alreadyLikedPost = await Post.findOne({ "likes.user": new mongoose.Types.ObjectId(req.user?._id) })

   if (alreadyLikedPost){
     return res.status(422).json(
       new ApiResponse(422, "You have already liked this post!")
     )
   }

   const likedPost = await Post.findOneAndUpdate(
    {
      _id: postId
    },
    {
      $push: {
        likes: { user: req.user?._id }
      }
    },
    {
      new: true
    }
   )

   if (!likedPost){
    return res.status(500).json(
      new ApiResponse(500, "Something went wrong while liking post!")
    )
   }

   await Post.updateOne(
     { "dislikes.user": new mongoose.Types.ObjectId(req.user?._id) },
     {
      $pull: {
         dislikes: { user: new mongoose.Types.ObjectId(req.user?._id) }
      }
     }
   )

   return res.status(200).json(
     new ApiResponse(200, "Post Liked Successfully!", likedPost)
   )


 } catch (error) {
   return res.status(500).json(
     new ApiResponse(500, error.message)
   )
 }
}

const dislikePost = async(req, res) => {
  try {
    const postId = req.params.postId

    if (!postId) {
      return res.status(400).json(
        new ApiResponse(400, "Please Provide Post ID")
      )
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json(
        new ApiResponse(404, "Post not exist with this ID")
      )
    }
    // check already disliked post
    const alreadyDislikedPost = await Post.findOne({ "dislikes.user": new mongoose.Types.ObjectId(req.user?._id) })

    if (alreadyDislikedPost) {
      return res.status(422).json(
        new ApiResponse(422, "You have already disliked this post!")
      )
    }

    const dislikedPost = await Post.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $push: {
          dislikes: { user: req.user?._id }
        }
      },
      {
        new: true
      }
    )

    if (!dislikedPost) {
      return res.status(500).json(
        new ApiResponse(500, "Something went wrong while disliking post!")
      )
    }

    await Post.updateOne(
      { "likes.user": new mongoose.Types.ObjectId(req.user?._id) },
      {
        $pull: {
          likes: { user: new mongoose.Types.ObjectId(req.user?._id) }
        }
      }
    )

    return res.status(200).json(
      new ApiResponse(200, "Post disliked Successfully!", dislikedPost)
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

export { createPost, getAllPosts, getPost, deletePost, likePost, dislikePost }