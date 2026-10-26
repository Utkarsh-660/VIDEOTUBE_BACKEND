import mongoose from "mongoose";
import { Apierror } from "../utils/api-error.js";
import dotenv from "dotenv"
import { HttpStatusCode } from "axios";
dotenv.config();
const errorHandler=(err,req,res,next)=>{
    let error=err;
  if(!(error instanceof Apierror )){
    const statusCode=error.statusCode||error instanceof
    mongoose.Error?HttpStatusCode.BadRequest:HttpStatusCode.InternalServerError;
    //we have to manipulate the message
    const message=error.message||"Something went wrong"
    error=new Apierror(statusCode,message,error?.errors||[],err.stack)
  }
const response={
    ...error,
    message:error.message,
    ...(process.env.NODE_ENV==="development"?{stack:error.stack}:{})
}
return res.status(error.statusCode).json(response)

}
export {errorHandler};