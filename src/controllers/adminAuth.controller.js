import { AdminAuth } from "../models/adminAuth.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { statusCodes } from "../constants/statusCodes.js";
import { successMessages } from "../constants/successMessage.js";
import { errorMessages } from "../constants/errorMessage.js";
import {
  cookiesOptions,
  defaultPassword,
  MailTypeEnum,
  UserTypeEnum,
} from "../constants/common.js";
import { sendMail } from "../utils/Nodemailer.js";
import jwt from "jsonwebtoken";
import { generateUniqueId } from "../utils/common.util.js";

const generateAccessAndRefreshToken = async (adminAuthenticationId) => {
  const adminAuth = await AdminAuth.findById(adminAuthenticationId);

  const accessToken = await adminAuth.generateAccessToken();

  const refreshToken = await adminAuth.generateRefreshToken();

  adminAuth.refreshToken = refreshToken;

  await adminAuth.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerAdmin = async (req, res) => {
  try {
    const {
      businessName,
      businessOwner,
      businessAddress,
      about,
      email,
      mobile,
      city,
      state,
      country,
    } = req.body;

    //  Check if user already exist
    const existingUser = await AdminAuth.findOne({ email });
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

    // Create new admin
    const admin = await AdminAuth.create({
      businessName,
      businessOwner,
      businessAddress,
      about,
      email,
      mobile,
      city,
      state,
      country,
      role: UserTypeEnum.admin,
      password: defaultPassword + mobile.slice(-4),
      refreshToken: null,
      verificationToken,
    });

    // Convert mongoose document to plain JS object and remove sensitive fields
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    delete adminResponse.refreshToken;

    // Sending welcome mail to registered user
    if (admin.email) {
      const mail = await sendMail(
        MailTypeEnum.verification,
        adminResponse,
        res
      );
      console.log("mail.messageId :>> ", mail.messageId);
    }

    // Remove verification token before sending response
    delete adminResponse.verificationToken;

    // Return success response
    return res
      .status(statusCodes.success.created)
      .json(
        new ApiResponse(
          statusCodes.success.created,
          adminResponse,
          successMessages.newAdminCreated
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

export const verifyAdmin = async (req, res) => {
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
    const admin = await AdminAuth.findOneAndUpdate(
      { email },
      { $set: { isVerified: true, isActive: true } },
      { new: true }
    );

    //  If not admin than return res with error
    if (!admin) {
      return res
        .status(statusCodes.error.notFound)
        .json(
          new ApiError(statusCodes.error.notFound, errorMessages.userNotFound)
        );
    }

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    delete adminResponse.refreshToken;
    delete adminResponse.verificationToken;

    // Sending registration success mail to registered user
    const mail = await sendMail(MailTypeEnum.registration, adminResponse);
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

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Get user by email
    const adminAuthResponse = await AdminAuth.findOne({ email });

    //  If no admin return res with error
    if (!adminAuthResponse) {
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
    const isPasswordValid = await adminAuthResponse.isPasswordCorrect(password);

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
    const { isVerified, isActive } = adminAuthResponse;
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
      adminAuthResponse._id
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

    const adminResponse = adminAuthResponse.toObject();
    delete adminResponse.password;
    delete adminResponse.refreshToken;
    delete adminResponse.verificationToken;

    //  Return user with Access_Token and Refresh_Token
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          statusCodes.success.ok,
          {
            adminResponse,
            accessToken,
            refreshToken,
          },
          successMessages.loginSuccess
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
