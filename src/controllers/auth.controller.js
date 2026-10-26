   //User regsiter

   import { asynchandler } from "../utils/asynchandler.js";
   import { Apierror } from "../utils/api-error.js";
   import { ApiResponse } from "../utils/api-response.js";
   import { User } from "../models/user.model.js";
   import {uploadOnCloudinary} from "../utils/cloudinary.js";
   import {DeleteFromCloudinary} from "../utils/cloudinary.js"
   import { forgotPasswordmailgen, sendEmail, userVerificationMailGen } from "../utils/mailgen.js";
   import crypto from "crypto";
   const registerUser=asynchandler(async(req,res)=>{
      const {email,fullname,username,password}=req.body
      
      const existUser=await User.findOne({$or
      :[{email},{username}]
      }) 
   
      
      if(existUser){
      throw new Apierror(409,"User already exist with the same email or username");
      }
   
      
   const avatar=req.files?.avatar?.[0]?.buffer

   const coverImage=req.files?.coverImage?.[0]?.buffer
   let result1;
   let result2;
   try {
      result1= await uploadOnCloudinary(avatar,"avatars");
      const avatarUrl=result1.secure_url;
      result2=await uploadOnCloudinary(coverImage,"coverImage");
      const coverImageUrl=result2.secure_url; 
   
   
   
      const user=await User.create({
         email:email,
         fullname:fullname,
         username:username,
         password:password,
         avatar:{
            url:result1.secure_url,
            publicId:result1.public_id,
         },
         coverImage:{
            url:result2.secure_url,
            publicId:result2.public_id
         }
   
      })
   
   
   
   const{hashedtoken,unhashedtoken,tokenexpiry}=  user.generatetemporarytokens();
   user.emailVerificationToken=hashedtoken
      user.emailVerificationExpiry=tokenexpiry
      await user.save({validateBeforeSave:false})
      const options={
      email:user?.email,
      subject:"Please Verify",
      mailgencontent:userVerificationMailGen(user.username,
         `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedtoken}`
      )
      }
      await sendEmail(options)
   
      const CreatedUser=await User.findById(user._id).select(
         "-password -emailVerificationToken -emailVerificationExpiry"
      )
      if(!CreatedUser){
         throw new Apierror(500,"Something went wrong while saving the user");
      }
   
      return res.status(200)
      .json(new ApiResponse(200,"User registered successfully. Please verify your email",CreatedUser));
   } catch (error) {
      //if something went wrong i have to delete the file
      if(result1){
         await DeleteFromCloudinary(result1.public_id);
      }
   if(result2){
      await DeleteFromCloudinary(result2.public_id);
   }
   console.log(error);
   console.log("Successfully deleted")
   throw new Apierror(500,"Something went wrong and files are deleted")
   }
   })

   
   const Login=asynchandler(async(req,res)=>{
   const {identifier,password}=req.body
   console.log("THe pssword is ",identifier,password);
   
   //lets find on the basis of email
   const existedUser=await User.findOne({$or:[
      {email:identifier},
      {username:identifier}
   ]})
   if(!existedUser){
      throw new Apierror(404,"User does not exist Please register")
   }
   const isMatched=await existedUser.isPasswordCorrect(password);
   if(!isMatched){
      throw new Apierror(400,"Password is wrong",[])
   }
   req.session.regenerate((err)=>{
      if(err){
         console.log(err);
         throw new Apierror(500,"Something went wrong")
      }
      req.session.userId=existedUser._id
      console.log("session created");
      req.session.save((err)=>{
         if(err){
            throw new Apierror(500,"Something went wrong while saving the session")
         }
         console.log("Session saved");
         return res.status(200)
         .json(new ApiResponse(200,"Logged in successfully",{user:existedUser}))
      })

   })

   
   })



   const Logout=asynchandler(async(req,res)=>{
      req.session.destroy((err)=>{
         if(err){
            throw new Apierror(500,"Logout failed")
         }
         res.clearCookie("connect.sid")
         return res.status(200)
         .json(new ApiResponse(200,"Logout is done successfully"));
      })
   })
   const CurrentUser=asynchandler(async(req,res)=>{
      const user=await User.findById(req.session.userId);
      return res.status(200)
      .json(new ApiResponse(200,"User data fetched successfully",user));
   })

   //the changepassword
   const changepassword=asynchandler(async(req,res)=>{
   const {oldpassword,newpassword}=req.body
   if(!oldpassword || !newpassword){
      throw new Apierror(400,"any of the field is missing")
   }
   const user=await User.findById(req.session.userId);
   const isMatched=await user.isPasswordCorrect(oldpassword);
   if(!isMatched){
      throw new Apierror(400,"Password does not match")
   }
   user.password=newpassword;
   await user.save({validateBeforeSave:false})
   return res.status(200).json(new ApiResponse(200,"Password is changed successfully"));

   })
   const verifyEmail=asynchandler(async(req,res)=>{
      const {VerificationToken}=req.params
      if(!VerificationToken){
         throw new Apierror(400,"  email Verification token is missing")
      }
      const hashtoken=crypto.createHash("sha256")
      .update(VerificationToken)
      .digest('hex');
      const user=await User.findOne({emailVerificationToken:hashtoken,emailVerificationExpiry:{$gt:Date.now()}});
      if(!user){
         throw new Apierror(404,"User does not exist");
      
      }
   user.emailVerificationExpiry=undefined
   user.emailVerificationToken=undefined
   user.isEmailVerified=true
   await user.save({validateBeforeSave:false})
   return res.status(200)
   .json(new ApiResponse(200,"Email is verified now"));
   })
   const forgotPassword=asynchandler(async(req,res)=>{
   const {email}=req.body
   const user=await User.findOne({email:email})
   if(!user){
      throw new Apierror(404,"User does not exist");
   }
   const {hashedtoken,unhashedtoken,tokenexpiry}=user.generatetemporarytokens()
   user.forgotPasswordToken=hashedtoken
   user.forgotPasswordExpiry=tokenexpiry
   await user.save({validateBeforeSave:false})
   const options={
      email:user.email,
      subject:"Please click to reset your password",
      mailgencontent:forgotPasswordmailgen(user.username,`${process.env.FORGOT_PASSWORD}/${unhashedtoken}`)

   }
   await sendEmail(options);
   return res.status(200)
   .json(new ApiResponse(200,"Password reset mail is sent on your mail ID",{}))
   })
const resetForgotPassword=asynchandler(async(req,res)=>{
const {resetToken}=req.params
const {newpassword}=req.body

const hashedtoken=crypto.createHash("sha256")
.update(resetToken)
.digest('hex')


const user=await User.findOne({forgotPasswordToken:hashedtoken,forgotPasswordExpiry:{$gt:Date.now()}})
if(!user)
{
   throw new Apierror(400,"token is expired")
}
user.password=newpassword
user.forgotPasswordToken=undefined
user.forgotPasswordExpiry=undefined
await user.save({validateBeforeSave:false});

return res.status(200)
.json(new ApiResponse
   (200,"password is changed successfully")
)


})
const getUserChannelProfile=asynchandler(async(req,res)=>{
   const {username}=req.params
   if(!username){
      throw new Apierror(400,"username is required");
   }
   const channel=await User.aggregate([
    {
      $match:{username:username?.toLowerCase()}
    },
    {
      $lookup:{
         from:"subscriptions",
         localField:"_id",
         foreignField:"channel",
         as:"subscribers"
      }

    },
    {
      $lookup:{
         from:"subscriptions",
         localField:"_id",
         foreignField:"subscriber",
         as:"subscribedTo",
      }
    },
    {
      $addFields:{
         subscriberCount:{
            $size:"$subscribers"
         },
         channelSubscribedToCount:{
            $size:"$subscribedTo"
         },
         isSubscribed:{
            $cond:{
               if:{$in:[req.user?._id,"$subscribers.subscriber"]},
               then:true,
               else:false
               
            },
         }
      }
    }
    ,
    {//project only neccessary data
      $project:{
         fullname:1,
         username:1,
         avatar:1,
         subscriberCount:1,
         isSubscribed:1,
         coverImage:1
      }
    }
   ])
   // we will get an array
   if(!channel.length){
      throw new Apierror(404,"Channel does not exist");
   }
   return res.status(200)
   .json(new ApiResponse(200,"Channel fetched successfully",channel[0]));
})

   export {registerUser,Login,CurrentUser,Logout,changepassword,verifyEmail,resetForgotPassword,forgotPassword,getUserChannelProfile};
