
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema=new Schema({
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},

video:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video",
    required:true
},
commentbody:{
    type:String,
    required:true,
}
},
{
    timestamps:true,
}
)

CommentSchema.plugin(mongooseAggregatePaginate);

export const Comment=mongoose.model("Comment",CommentSchema);

