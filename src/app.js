import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/Logger.js";

const app = express();

app.set('view engine', 'ejs');

app.use(helmet()) // For security

// To handle CORS related issues
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}))

app.use(express.json({ limit: '20kb' })) // To define size of json which can expect
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // To deal with body parameters
app.use(express.static("public")) // To handle static assets
app.use(cookieParser()) // To set and get cookies from client

// Log the incoming request details
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
});


// routes
import userRouter from "./routes/users.routes.js"
import postRouter from "./routes/posts.routes.js"
import commentRouter from "./routes/comments.routes.js"


app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)

export default app;