import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})
//const DBconnect=mongoose.connect(process.env.MONGO_URL)
const DBconnect=async()=>{
    try {
        console.log(process.env.DB_NAME)
         await  mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
         console.log("successfully connected to DB");
         
    } catch (error) {
        console.log(`X something went wrong ${error}`);
        process.exit(1);
    }
  
  
}
export default DBconnect;