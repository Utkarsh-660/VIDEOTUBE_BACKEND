import mongoose,{Schema} from "mongoose";

const TweetSchema=new Schema({
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},
tweetBody:{
    type:String,
    required:true,
},

},
{
    timestamps:true,
})

export const Tweet=mongoose.model("Tweet",TweetSchema);