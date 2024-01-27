import express from "express";
import colors from "colors"
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary"
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// routes
import testRoute from "./routes/testRoutes.js"
import userRoutes from "./routes/userRoutes.js" 
import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
// dot env config
dotenv.config()
// database
connectDB() 

// stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET)

// cloudniary setup
cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_APIKEY,
  api_secret:process.env.CLOUDINARY_SECRET
})

// rest object
const app=express();

// middleware 
app.use(helmet());
app.use(mongoSanitize())
app.use(morgan("dev"));
app.use((express.json())); 
app.use(cors())
app.use(cookieParser())

//routes
app.use("/api/v1",testRoute)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/cat",categoryRoutes)
app.use("/api/v1/order",orderRoutes)


app.get("/",(req,res)=>{
res.status(200).send("<h1>Welcome To Node Server</h1>")
})
// port
const PORT=process.env.PORT || 8080
app.listen(PORT,()=>{
// console.log("Server Running".bgYellow.white);
console.log(`Server running on port ${process.env.PORT} on ${process.env.NODE_ENV}`.bgYellow.white)
})

