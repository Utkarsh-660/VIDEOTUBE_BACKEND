import express from 'express'
import dotenv from "dotenv"
import { app } from './app.js';
import DBconnect from './db/index.js';
dotenv.config({
    path:"./.env"
});

const port=process.env.PORT||3000
console.log(process.env.PORT);

/*DBconnect
.then(()=>{
    console.log("Successfully connected to DB");
    app.listen(port,()=>{
        console.log(`Listening at the port ${port}`);
    })
})
.catch((error)=>{
console.log(`X some thing went wrong ${error}`);
process.exit(1);

})*/
DBconnect()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Listening to the Port ${port}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB error",err);
    process.exit(1);
})