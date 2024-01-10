import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import stripeInstance from "../utils/Stripe.js";

const userSchema = mongoose.Schema({
  email:{
    type: String,
    required: [true, 'Email is required!'],
    index: true,
    lowercase: true,
    unique: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required!']
  },
  fullName: {
    type: String,
    requied: [true, "Full Name is required!"]
  },
  stripeCustomerID: {
    type: String
  },
  refreshToken:{
    type: String
  }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.post("save", async function (doc) {
  try {
    if (doc.stripeCustomerID) return;

    const customer = await stripeInstance.customers.create({
      email: doc.email,

    })

    await doc.updateOne({ $set: { stripeCustomerID: customer.id, name: doc.fullName } });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
  }
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}

export const User = mongoose.model('User', userSchema)