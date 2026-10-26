import express from "express"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import MongoStore from "connect-mongo" 
import { errorHandler } from "./middleware/error.middleware.js"
import authRouter from "./routes/auth_routes.js"
const app=express()
dotenv.config({
    path:"./.env"
})

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"))
app.use(cors({
    origin:  process.env.CORS_ORIGIN?.split(",") ||"http://localhost:5173",

    methods:["GET","PUT","DELETE","POST"],
    allowedHeaders:["Content-Type","Authorization","Range"],
    credentials:true
}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({ mongoUrl:`${process.env.MONGO_URL}/${process.env.DB_NAME}` }),
    cookie:{
         httpOnly: true,
         secure:false,
    maxAge: 24 * 60 * 60 * 1000
  }
    },

))

//adding the healthcheck route
import healthrouter from "./routes/healthcheck.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likesRouter from "./routes/likes.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"

app.use("/api/v1/healthcheck",healthrouter)
app.use("/api/v1/healthcheck/insta",healthrouter)
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/likes",likesRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);
app.use(errorHandler)
export {app};