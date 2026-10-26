import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import {requireAuth} from "../middleware/auth.middleware.js"
import { changepassword, CurrentUser, Login, Logout, registerUser, verifyEmail,forgotPassword, resetForgotPassword } from "../controllers/auth.controller.js";
import validate from "../middleware/validator.middleware.js";
import { LoginValidator, UserRegisterValidator,UserChangePasswordValidator, ResetPasswordValidator, ForgotPasswordValidator } from "../validator/index.js";
const router=Router()
router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),UserRegisterValidator(),validate,registerUser)

router.route("/Login").post(LoginValidator(),validate,Login)
router.route("/Logout").post(requireAuth,Logout);
router.route("/CurrentUser").get(requireAuth,CurrentUser);
router.route("/changepassword").patch(requireAuth,UserChangePasswordValidator(),validate,changepassword);
router.route("/forgot-password").post(ForgotPasswordValidator(),validate,forgotPassword)
router.route("/verify-email/:VerificationToken").get(verifyEmail)
router.route("/reset-password/:resetToken").post(ResetPasswordValidator(),validate,resetForgotPassword);
export default router;
