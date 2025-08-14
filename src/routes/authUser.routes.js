import { Router } from "express";
import { changeCurrentPassword, forgotPasswordUser, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/authUser.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// attach middleware and validator
// unsecured routes : does not Requires JWT auth
router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(),validate,loginUser);

router.route("/verify-email/:VerificationToken").get(verifyEmail);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordUser);

router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword);


// secure routes : Requires JWT auth
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/current-user").post(verifyJWT,getCurrentUser);

router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator,validate,changeCurrentPassword);

router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);




export default router;
