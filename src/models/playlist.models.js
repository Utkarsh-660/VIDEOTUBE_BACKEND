
import mongoose ,{Schema} from "mongoose";

const PlaylistSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",

        },
        ],
        title:{
            type:String,
            required:true,
        }
        ,
        description:{
            type:String,
            required:true,
        }
},

{
    timestamps:true
});
 export const Playlist=mongoose.model("Playlist",PlaylistSchema);
