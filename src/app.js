import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// To handle CORS related issues
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}))

app.use(express.json({ limit: '20kb' })) // To define size of json which can expect
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // To deal with query parameters
app.use(express.static("public")) // To handle static assets
app.use(cookieParser()) // To set and get cookies from client
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms") // request server logs
)


// routes
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/posts.routes.js"

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)

export default app;