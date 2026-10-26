import { body } from "express-validator";
const UserRegisterValidator=()=>{
return[
body('email')
.notEmpty()
.withMessage("Email field is required")
.isEmail()
.withMessage("Email is not in the good format")
.trim()
,
body('username')
.notEmpty()
.withMessage("username is required")
.trim()
,
body('password')
.exists()
.withMessage("password is required")
.trim()
.isLength({min:8})
.withMessage("Min length is 8 required"),

body('fullname')
.notEmpty()
.withMessage("Fullname is required")
.trim()


]

};
const LoginValidator=()=>{
    return [
        body('identifier')
        .notEmpty()
        .withMessage("Username is required")
        .trim()
        ,
        body('password')
        .notEmpty()
        .withMessage("Password is required"),

       



    ]
}
const UserChangePasswordValidator=()=>{
    return[

body('oldpassword')
.notEmpty()
.withMessage("Old password is required")
.trim()
,
body('newpassword')
.notEmpty()
.withMessage("new Password is required")
.trim()

    ]
}
const ResetPasswordValidator=()=>{
    return[
        body('newpassword')
        .notEmpty()
        .withMessage("new password field is empty")
    ]
}
const ForgotPasswordValidator=()=>{
    return[
        body('email')
        .notEmpty()
        .withMessage("Email is required")

    ]
}
const PublishVideoValidator=()=>{
    return [
        body('title')
        .notEmpty()
        .withMessage("Title is required")
        .trim(),

        body('description')
        .notEmpty()
        .withMessage("Description is required")
        .trim(),

        body('thumbnailfile')
        .custom((value, { req }) => {
            if (!req.files?.thumbnailfile || req.files.thumbnailfile.length === 0) {
                throw new Error("Thumbnail file is required");
            }
            return true;
        }),

        body('VideoFile')
        .custom((value, { req }) => {
            if (!req.files?.VideoFile || req.files.VideoFile.length === 0) {
                throw new Error("Video file is required");
            }
            return true;
        })
    ]
}

const addCommentValidator=()=>{
    return [
        body('content')
        .notEmpty()
        .withMessage("Content is required")
        .trim()
    ]
}

const updateCommentValidator=()=>{
    return [
        body('content')
        .notEmpty()
        .withMessage("Content is required")
        .trim()
    ]
}


export {UserRegisterValidator,LoginValidator,UserChangePasswordValidator,ResetPasswordValidator,ForgotPasswordValidator,PublishVideoValidator,addCommentValidator,updateCommentValidator};