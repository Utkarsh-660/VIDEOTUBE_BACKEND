import {ApiResponse} from "../utils/api-response.js"
import { asynchandler } from "../utils/asynchandler.js";

/*const healthCheck=(req,res)=>{
  try {
    res.status(200).json(new ApiResponse(200,"Server is runnning good",{}));
    
  } catch (error) {
 
  }
}
const instagramcontroller=(req,res)=>{
 try {
    res.status(200).json(new ApiResponse(200,"hello back to insta",{}));

 } catch (error) {
    
 }
}
*/
const healthCheck=asynchandler( async(req,res)=>{
   return  res.status(200)
    .json(new ApiResponse(200,"Server is running good chodu",{}));
})
const instagramcontroller=asynchandler(async(req,res)=>{
   return  res.status(200)
    .json(new ApiResponse(200,"hello back to insta",{}));

})
export {healthCheck,instagramcontroller};
