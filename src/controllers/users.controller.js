import {  User } from "../models/user.models.js"
import ApiResponse from "../utils/ApiResponse.js"

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

export { registerUser }