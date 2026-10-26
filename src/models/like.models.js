import mongoose, {Schema}  from "mongoose";
const likeSchema=new Schema({
//so the like can be on video,tweet,comment
video:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video",
    

},
comment:
{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment",
},
tweet:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tweet",
},
likedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}


},
{
    timestamps:true
})

export const Likes=mongoose.model("Likes",likeSchema);
