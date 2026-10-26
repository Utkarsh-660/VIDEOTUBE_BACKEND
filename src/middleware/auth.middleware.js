import mongoose from "mongoose";
import { ApiResponse } from "../utils/api-response.js";
import { Apierror } from "../utils/api-error.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.models.js";

const requireAuth=asynchandler(async(req,res,next)=>{
if(!req.session.userId){
    throw new Apierror(401,"Please login first");
}
const userid=req.session.userId
const user=await User.findById(userid).select("-password");
if(!user){
    throw new Apierror(404,"User does not exist");
}
req.user=user
return next();

})

const authorizeVideoOwner = asynchandler(async (req, res, next) => {
    const { VideoId } = req.params;

    if (!VideoId || !mongoose.Types.ObjectId.isValid(VideoId)) {
        throw new Apierror(400, "Invalid Video ID");
    }

    const video = await Video.findById(VideoId);
    if (!video) {
        throw new Apierror(404, "Video does not exist");
    }

    const userId = req.session?.userId;
    if (!userId) {
        throw new Apierror(401, "Please login first");
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new Apierror(403, "You are not authorized to perform this action on this video");
    }

    req.video = video;
    return next();
});

export { requireAuth, authorizeVideoOwner };