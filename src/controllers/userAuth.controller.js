import { UserAuth } from "../models/userAuth.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";
import { statusCodes } from "../constants/statusCodes.js";
import { successMessages } from "../constants/successMessage.js";
import { errorMessages } from "../constants/errorMessage.js";
import {
  cookiesOptions,
  defaultPassword,
  MailTypeEnum,
  UserTypeEnum,
} from "../constants/common.js";
import { sendMail } from "../utils/nodemailer.util.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userAuthenticationId) => {
  const userAuth = await UserAuth.findById(userAuthenticationId);

  const accessToken = await userAuth.generateAccessToken();

  const refreshToken = await userAuth.generateRefreshToken();

  userAuth.refreshToken = refreshToken;

  await userAuth.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    //  Check if user already exist
    const existingUser = await UserAuth.findOne({ email });
    if (existingUser) {
      return res
        .status(statusCodes.error.conflicts)
        .json(
          new ApiError(
            statusCodes.error.conflicts,
            errorMessages.emailAlreadyExist
          )
        );
    }

    const verificationToken = jwt.sign(
      { email },
      process.env.VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY,
      }
    );

    // Create new user
    const user = await UserAuth.create({
      name,
      email,
      mobile,
      refreshToken: null,
      password: defaultPassword + mobile.slice(-4),
      verificationToken,
      role: UserTypeEnum.user,
    });

    // Convert mongoose document to plain JS object and remove sensitive fields
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    // Sending welcome mail to registered user
    if (user.email) {
      const mail = await sendMail(MailTypeEnum.verification, userResponse, res);
      console.log("mail.messageId :>> ", mail.messageId);
    }

    // Remove verification token before sending response
    delete userResponse.verificationToken;

    // Return success response
    return res
      .status(statusCodes.success.created)
      .json(
        new ApiResponse(
          statusCodes.success.created,
          userResponse,
          successMessages.newUserCreated
        )
      );
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(statusCodes.serverError.internalServerError)
      .json(
        new ApiError(
          statusCodes.serverError.internalServerError,
          error,
          errorMessages.internalServerError
        )
      );
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    //  Verifying token
    const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);

    //  If valid token destruct email else return res with error
    const { email } = decoded;
    if (!email) {
      return res
        .status(statusCodes.error.badRequest)
        .json(
          new ApiError(statusCodes.error.badRequest, errorMessages.invalidToken)
        );
    }

    //  Find user by email and update isVerified and isActive
    const user = await UserAuth.findOneAndUpdate(
      { email },
      { $set: { isVerified: true, isActive: true } },
      { new: true }
    );

    //  If not user than return res with error
    if (!user) {
      return res
        .status(statusCodes.error.notFound)
        .json(
          new ApiError(statusCodes.error.notFound, errorMessages.userNotFound)
        );
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.verificationToken;

    // Sending registration success mail to registered user
    const mail = await sendMail(MailTypeEnum.registration, userResponse);
    console.log("mail.messageId :>> ", mail.messageId);

    // Return success response
    return res
      .status(statusCodes.success.ok)
      .json(
        new ApiResponse(
          statusCodes.success.ok,
          {},
          successMessages.verifyUserAccount
        )
      );
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(statusCodes.serverError.internalServerError)
      .json(
        new ApiError(
          statusCodes.serverError.internalServerError,
          error,
          errorMessages.internalServerError
        )
      );
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Get user by email
    const userAuthResponse = await UserAuth.findOne({ email });

    //  If no user return res with error
    if (!userAuthResponse) {
      return res
        .status(statusCodes.error.notFound)
        .json(
          new ApiError(
            statusCodes.error.notFound,
            errorMessages.userNotFound,
            errorMessages.userDoesNotExist
          )
        );
    }

    //  Compare password
    const isPasswordValid = await userAuthResponse.isPasswordCorrect(password);

    //  If invalid password return res with error
    if (!isPasswordValid) {
      return res
        .status(statusCodes.error.badRequest)
        .json(
          new ApiError(
            statusCodes.error.badRequest,
            errorMessages.invalidCredential,
            errorMessages.invalidCredential
          )
        );
    }

    //  Check is user verified and active
    const { isVerified, isActive } = userAuthResponse;
    if (!(isVerified && isActive)) {
      return res
        .status(statusCodes.error.unauthorized)
        .json(
          new ApiError(
            statusCodes.error.unauthorized,
            errorMessages.unauthorizedRequest,
            errorMessages.unauthorizedRequest
          )
        );
    }

    //  Generate Access_Token and Refresh_Token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      userAuthResponse._id
    );

    //  If not Access_Token || Refresh_Token return res with error
    if (!(accessToken && refreshToken)) {
      return res
        .status(statusCodes.error.unauthorized)
        .json(
          new ApiError(
            statusCodes.error.unauthorized,
            errorMessages.failedToGenerateNewTokens,
            errorMessages.failedToGenerateNewTokens
          )
        );
    }

    const userResponse = userAuthResponse.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.verificationToken;

    //  Return user with Access_Token and Refresh_Token
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: userResponse,
            accessToken,
            refreshToken,
          },
          successMessages.userLoggedIn
        )
      );
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(statusCodes.serverError.internalServerError)
      .json(
        new ApiError(
          statusCodes.serverError.internalServerError,
          error,
          errorMessages.internalServerError
        )
      );
  }
};
