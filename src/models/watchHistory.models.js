import mongoose ,{Schema} from "mongoose"


const watchHistorySchema=new Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
video:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video",
},
watchedAt:{
    type:Date,
    default:Date.now
}

})

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);