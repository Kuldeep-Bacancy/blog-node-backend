import { User } from "../models/user.models.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log(refreshToken);

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
}

const registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body

    const existingUser = await User.findOne({ email: email })

    if(existingUser){
      return res.status(422).json(
        new ApiResponse(422, "Email already taken!")
      )
    }

    console.log("existing User", existingUser);

    const user = await User.create({
      email,
      password,
      fullName
    })

    if(!user){
      return res.status(422).json(
        new ApiResponse(422, 'Unable to create user!')
      )
    }

    return res.status(200).json(
      new ApiResponse(200, 'User created Successfully!', user)
    )
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email: email})

    if(!existingUser){
      return res.status(400).json(
        new ApiResponse(400, "User not found with email!")
      )
    }

    const passwordCheck = await existingUser.isPasswordCorrect(password)

    if(!passwordCheck){
      return res.status(400).json(
        new ApiResponse(400, "Credentials Wrong!")
      )
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingUser._id)

    const loggedInUser = await User.findById(existingUser._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
           .status(200)
           .cookie('accessToken', accessToken, options)
           .cookie('refreshToken', refreshToken, options)
           .json(
             new ApiResponse(200, "User logged in successfully", { user: loggedInUser, accessToken, refreshToken })
           )
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

export { registerUser, loginUser }