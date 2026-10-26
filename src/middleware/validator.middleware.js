import { validationResult } from "express-validator";
import { Apierror } from "../utils/api-error.js";
 const validate=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    const extractederrors=[];
    errors.array().map((err)=>
    extractederrors.push({[err.path]:err.msg})
    )
    throw new Apierror(422,"Received data is not valid",extractederrors);
}
export default validate;