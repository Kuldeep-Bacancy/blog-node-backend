import { User } from "../models/user.models.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import sendMail from "../utils/mailjet.js";


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

    const response = await sendMail("kuldeepchotaliya17@gmail.com", loggedInUser?.fullName, "Welcome to Blog app!", "Hello There! Welcome to blog app!")

    console.log("response", response.response);

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

const logoutUser = async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.user?._id },
      {
        $set: {
          refreshToken: ""
        }
      },
      { new: true }
    )

    return res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(
        new ApiResponse(200, "User logged out successfully")
      )
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
  
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findOne({ _id: req.user?._id })

    const passwordCheck = await user.isPasswordCorrect(currentPassword)

    if(!passwordCheck){
      return res.status(400).json(
        new ApiResponse(400, 'Current password is wrong!')
      )
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
      new ApiResponse(200, 'Password Updated Successfully!')
    )

  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, error.message)
    )
  }
}

const updateUserInfo = async (req, res) => {
  const { fullName, email } = req.body

  if(!fullName || !email){
    return res.status(400).json(
      new ApiResponse(400, "FullName or Email required")
    )
  }

  const updatedUser = await User.updateOne(
    { _id: req.user?._id },
    { $set: { fullName: fullName, email: email} }
  )

  if (!updatedUser) {
    return res.status(500).json(
      new ApiResponse(500, "Can't update user right now!")
    )
  }

  const user = await User.findOne({ _id: req.user?._id }).select('-password -refreshToken')

  return res.status(200).json(
    new ApiResponse(200, "User updated successfully!", user)
  )
  
}
export { registerUser, loginUser, logoutUser, changePassword, updateUserInfo }