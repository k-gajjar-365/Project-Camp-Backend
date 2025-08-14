// used to query the database
import { User } from "../models/user.models.js";
// handlers
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailGenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token.",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerfied: false,
  });

  console.log(user.refreshToken);
  

  const { unHasedToken, hasedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hasedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // send mail
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailGenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHasedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registreing user");
  }

  return res.status(201).json(
    new ApiResponse(200, {
      user: createdUser,
      message:
        "User registred successfully and verification email has been sent on your email.",
    }),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exists.");
  }

  const isPassword = await user.isPasswordCorrect(password);

  if (!isPassword) {
    throw new ApiError(400, "Invalid Credentials.");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.accessToken = accessToken;
  user.save({validateBeforeSave: false})
  
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while user login");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully.",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        // sets refresh token empty after finding user
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched : "));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { VerificationToken } = req.params;

  if (!VerificationToken) {
    throw new ApiError(400, "Email Verification token is missing.");
  }

  let hasedToken = crypto
    .createHash("sha256")
    .update(VerificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hasedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or expired.");
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  user.isEmailVerfied = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerfied: true }, "Email is Verified."));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }

  if (user.isEmailVerfied) {
    throw new ApiError(409, "Email is already verified.");
  }

  const { unHasedToken, hasedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hasedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // send mail
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailGenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHasedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email id."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access.");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET      
    );
    

    const user = await User.findById(decodedRefreshToken?._id);
    

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }    

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired.");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token refreshed.",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token.(Catch Block)");
  }
});

const forgotPasswordUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }

  const { unHasedToken, hasedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hasedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Password rest request",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHasedToken}`,
    ),
  });

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Password reset mail has been sent.")
  )

});

const resetForgotPassword = asyncHandler(async (req, res) => {
    const {resetToken} = req.params
    const {newPassword} = req.body

    let hasedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

      const user = await User.findOne({
        forgotPasswordToken: hasedToken,
        forgotPasswordExpiry: {
          $gt: Date.now()
        }
      });

      if(!user) {
        throw new ApiError(489, "Token is invalid or expired.")
      }

      user.forgotPasswordExpiry = undefined
      user.forgotPasswordToken = undefined

      user.password = newPassword
      await user.save({validateBeforeSave: false})

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "Password reset successfully."
          )
        )
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body
    
   const user = await User.findById(req.user?._id);

   const isPasswordValid = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordValid) {
    throw new ApiError(400, "Invalid old password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave: false})

   return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password Changed Successfully."
      )
    )

})

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordUser,
  resetForgotPassword,
  changeCurrentPassword
};
