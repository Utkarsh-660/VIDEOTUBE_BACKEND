import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Apierror } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
const getAllVideos = asynchandler(async (req, res) => {
   const {page=1,limit=10,query,sortBy,sortType,userId}=req.query;
   const pipeline=[]
   pipeline.push({$match:{isPublished:true}});
   if(query){
    pipeline.push({
        $match:{
            $or:[
                {title:{$regex:query,$options:"i"}},
                {description:{$regex:query,$options:"i"}}
            ]
        }
    })
   }
   if(userId){
    if(!mongoose.Types.ObjectId.isValid(userId))
        throw new Apierror(400,"Invalid UserID");
    pipeline.push({$match:{owner:new mongoose.Types.ObjectId(userId)}})
   }
  pipeline.push({ 
    $lookup:{
        from:"users",
        localField:"owner",
        foreignField: "_id",
        as:"owner",
        pipeline:[{$project:{fullname:1,username:1,avatar:1}}]
    }
  })
  if(sortBy&&sortType){
    pipeline.push({$sort:{[sortBy]:sortType==="asc"?1:-1}})
  }
  else{
    pipeline.push({$sort:{createdAt:-1}})
  }
  const options={
    page:parseInt(page,10),
    limit:parseInt(limit,10)
  }
  const result= await Video.aggregatePaginate(Video.aggregate(pipeline),options);
  return res.status(200).json(new ApiResponse(200,"Videos fetched successfully",result))
});

const  publishAVideo = asynchandler(async (req, res) => {
    const {title,description}=req.body
    const Videofile=req.files?.VideoFile?.[0];
    const thumbnail=req.files?.thumbnailfile?.[0];

    if(!Videofile){
        throw new Apierror(400,"Video file is required");
    }
    if(!thumbnail){
        throw new Apierror(400,"Thumbnail file is required");
    }

    const VideoBuffer=Videofile.buffer;
    const thumbnailBuffer=thumbnail.buffer;
    const VideoUpload=await uploadOnCloudinary(VideoBuffer,"Video");
    const thumbnailUpload=await uploadOnCloudinary(thumbnailBuffer,"Thumbnail");
    const video= await Video.create(
        {
            title,
            description,
            VideoFile:VideoUpload.url,
            ThumbnailFile:thumbnailUpload.url,
            owner:req.user?._id || req.session?.userId,
            isPublished:true,
            VideoDuration:VideoUpload.duration
        }
    )

return res.status(201).json(new ApiResponse(201,"Successfully uploaded the video",video));
});

const getVideoById = asynchandler(async (req, res) => {
    const {VideoId}=req.params;
   
    
    const video=await Video.findById(VideoId).select("-VideoFile");
    if(!video){
       throw new Apierror(404,"Video does not exist");
    }
return res.status(200).json(new ApiResponse(200,"Video found successfully",video));
});

const updateVideo = asynchandler(async (req, res) => {
    const {VideoId}=req.params
    const {title,description}=req.body
    const thumbnailBuffer=req.file?.buffer;
    const video=req.video || await Video.findById(VideoId);
    if(!video){
        throw new Apierror(404,"Video does not exist");
    }
    if(thumbnailBuffer){
        const uploadResult= await uploadOnCloudinary(thumbnailBuffer,"Thumbnail")
        video.ThumbnailFile=uploadResult.url
    }
    if(title){
        video.title=title;
    }
    if(description){
        video.description=description;
    }
    const newvideo=await video.save();
    return res.status(200)
    .json(new ApiResponse(200,"Video is updated successfully",newvideo));

});

const deleteVideo = asynchandler(async (req, res) => {
    const {VideoId}=req.params;
    const video=req.video || await Video.findById(VideoId);
    if(!video){
        throw new Apierror(404,"Video does not exist");
    }

    const del=await Video.findByIdAndDelete(video._id);
    if(!del){
        throw new Apierror(400,"Something went wrong while deleting the video");
    }
    return res.status(200).json(new ApiResponse(200,"Video is deleted successfully",{}));
});
const StreamVideo=asynchandler(async(req,res)=>{

   console.log("STREAM HIT",req.params); 
const {VideoId}=req.params;
console.log(VideoId)
const video=await Video.findById(VideoId);
if(!video){
    throw new Apierror(404,"Video not found");
}
//access control
if(!video.isPublished &&(!req.user || video.owner.toString()!==req.user._id.toString()))
{throw new Apierror(403,"Not autorhized to see the vidoe");


}
const cloudinaryUrl=video.VideoFile;
const range=req.headers.range

if(!range){
    const response=await axios.get(cloudinaryUrl,{
        responseType:"stream"//dont collect the entrie video .. response in readable stream
    });
   
    res.writeHead(200,{
        "Content-Type":"video/mp4",
        "Content-Length":response.headers["content-length"],
        "Accept-Ranges":"bytes"
        //You are allowed to request specific portions of this video using byte ranges

    })
    response.data.pipe(res);
    return;
}
try{
    const upstreamResponse=await axios.get(cloudinaryUrl,{
        headers:{Range:range},
        responseType:"stream"
    })
      
    res.writeHead(206,{
        "Content-Range":upstreamResponse.headers["content-range"],
        "Accept-Ranges":"bytes",
        "Content-Length":upstreamResponse.headers["content-length"],
        "Content-Type":"video/mp4"

    })
  
    upstreamResponse.data.pipe(res);
    //good part req.on study
    
    req.on("close",()=>{
        upstreamResponse.data.destroy() //clinet stop asking
    })
}
catch(error){
 console.log("Stream error",error.message);
 if(!req.headersSent){
    return res.status(error.respsonse?.status || 500).end()
 }
 

}



})




export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    StreamVideo
};
