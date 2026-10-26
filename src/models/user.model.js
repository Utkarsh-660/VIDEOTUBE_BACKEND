import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto";
import { randomBytes, createHash } from "crypto";
const userSchema=new Schema(
    {
username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true,
},
email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    index:true
},
password:{
    type:String,
    required:[true,"Password is required"],
    trim:true,
},
fullname:{
    type:String,
    required:true,
    trim:true,
    index:true,

},
avatar:{
url:{
    type:String,
    required:true,
},
publicId:{
    type:String,
    required:true,
}


},

coverImage:{
 url:{
    type:String,
    required:true,
},
publicId:{
    type:String,
    required:true,
}
},
//watchHistory will be an array of objects
/*
one user can have multiple videos in watchhistory 
as same one video can be in multiple user watchhistory that
why i created as a separate model

*/
isEmailVerified:{
type:Boolean,
default:false
},
refreshToken:{
    type:String
},
forgotPasswordToken:{
    type:String,
},
forgotPasswordExpiry:{
    type:Date
},
emailVerificationToken:{
    type:String
},
emailVerificationExpiry:{
    type:Date
}


},{
    timestamps:true
}
)
userSchema.pre("save",async function(){
    if(!this.isModified("password"))return;
    this.password=await bcrypt.hash(this.password,10)
});
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)

}
userSchema.methods.generatetemporarytokens=function(){
    const unhashedtoken=crypto.randomBytes(20).toString("hex");
    const hashedtoken=crypto.createHash("sha256")
    .update(unhashedtoken)
    .digest("hex")

    const tokenexpiry=Date.now()+20*60*60*1000;
    return {unhashedtoken,hashedtoken,tokenexpiry};

} 
const User=mongoose.model("User",userSchema);
export {User};