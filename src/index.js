import dotenv from 'dotenv'
import connectDB from "./db/connect.js";
import app from './app.js'

dotenv.config({
  path: './.env'
})

connectDB()
.then(() => {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log("Server listening on:", port);
  })

  app.get('/', (req, res) => {
    res.send('Welcome to Blog app!')
  })
}
)
.catch((error) => {
  console.log("DB connection failed", error.message);
})
