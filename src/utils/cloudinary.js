import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
import {Readable} from "stream";
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})
console.log(process.env.CLOUDINARY_API_KEY)
// buffer mai 
const uploadOnCloudinary=(buffer,folder)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream({
            folder,
            resource_type:"auto"
        },
    (error,result)=>{
        if(error){
             return reject(error);
        }
        return resolve(result);
    }
    )
    Readable.from(buffer).pipe(uploadStream)

    })
}
const DeleteFromCloudinary=async(publicId)=>{
    try {
        console.log(publicId);
        const result=await cloudinary.uploader.destroy(publicId);
        console.log("Deleted the file of public ID",publicId);
    } catch (error) {
        console.log("Something went wrong",error);
        
    }
}
export  {uploadOnCloudinary,DeleteFromCloudinary};