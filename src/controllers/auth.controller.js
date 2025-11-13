import {
  UserTypeEnum,
  defaultPassword,
  MailTypeEnum,
  cookiesOptions,
} from "../constants/common.js";
import { errorMessages } from "../constants/errorMessage.js";
import { successMessages } from "../constants/successMessage.js";
import { statusCodes } from "../constants/statusCodes.js";
import { AdminAuth } from "../models/adminAuth.model.js";
import { UserAuth } from "../models/userAuth.model.js";
import { sendMail } from "../utils/nodemailer.util.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (model, authenticationId) => {
  const auth = await model.findById(authenticationId);

  const accessToken = await auth.generateAccessToken();

  const refreshToken = await auth.generateRefreshToken();

  auth.refreshToken = refreshToken;

  await auth.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerAccount = async (req, res) => {
  try {
    const {
      role,
      name,
      businessName,
      businessOwner,
      businessAddress,
      about,
      email,
      mobile,
      city,
      state,
      country,
      adminId,
    } = req.body;

    //  Select model and role-specific configuration
    const isAdmin = role === UserTypeEnum.admin;
    const Model = isAdmin ? AdminAuth : UserAuth;

    //  Check if user already exists
    const existing = await Model.findOne({ email });
    if (existing) {
      throw new ApiError(
        statusCodes.error.conflicts,
        errorMessages.emailAlreadyExist
      );
    }

    //  Generate verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.VERIFICATION_TOKEN_SECRET,
      { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY }
    );

    //  Common data
    const commonData = {
      email,
      mobile,
      password: defaultPassword + mobile.slice(-4),
      refreshToken: null,
      verificationToken,
      role,
    };

    // Merge role-specific fields
    const newUserData = isAdmin
      ? {
          ...commonData,
          businessName,
          businessOwner,
          businessAddress,
          about,
          city,
          state,
          country,
        }
      : {
          ...commonData,
          name,
          adminId,
        };

    // Create record
    const createdUser = await Model.create(newUserData);

    // Convert to object and sanitize
    const authResponse = createdUser.toObject();
    delete authResponse.password;
    delete authResponse.refreshToken;

    //  Send mail
    if (email) {
      const mail = await sendMail(MailTypeEnum.verification, authResponse);
      console.log("mail.messageId :>> ", mail.messageId);
    }

    delete authResponse.verificationToken;

    // Send response
    return res
      .status(statusCodes.success.created)
      .json(
        new ApiResponse(
          statusCodes.success.created,
          authResponse,
          isAdmin
            ? successMessages.newAdminCreated
            : successMessages.newUserCreated
        )
      );
  } catch (error) {
    console.log("error :>> ", error.error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const { role } = req;

    if (!role) {
      throw new ApiError(
        statusCodes.error.badRequest,
        errorMessages.invalidRoleProvided
      );
    }

    const Model = UserTypeEnum.admin === role ? AdminAuth : UserAuth;

    //  Verify token
    const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);
    const { email } = decoded;

    if (!email) {
      throw new ApiError(
        statusCodes.error.badRequest,
        errorMessages.invalidToken
      );
    }

    const updatedAccount = await Model.findOneAndUpdate(
      { email },
      { $set: { isVerified: true, isActive: true } },
      { new: true }
    );

    if (!updatedAccount) {
      throw new ApiError(
        statusCodes.error.notFound,
        errorMessages.userNotFound
      );
    }

    const response = updatedAccount.toObject();
    delete response.password;
    delete response.refreshToken;
    delete response.verificationToken;

    // Sending registration success mail to registered user
    const mail = await sendMail(MailTypeEnum.registration, response);
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
    console.log("error :>> ", error.error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};

export const loginAccount = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const Model = role === UserTypeEnum.admin ? AdminAuth : UserAuth;

    //  Get account details by email
    const authResponse = await Model.findOne({ email });

    if (!authResponse) {
      throw new ApiError(
        statusCodes.error.notFound,
        errorMessages.userNotFound
      );
    }

    //  Validate password
    const isPasswordValid = await authResponse.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(
        statusCodes.error.badRequest,
        errorMessages.invalidCredential
      );
    }

    //  Check if verified and active
    const { isVerified, isActive } = authResponse;
    if (!(isVerified && isActive)) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.unauthorizedRequest
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      Model,
      authResponse._id
    );

    if (!(accessToken && refreshToken)) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.failedToGenerateNewTokens
      );
    }

    const response = authResponse.toObject();
    delete response.password;
    delete response.refreshToken;
    delete response.verificationToken;

    //  Send response
    return res
      .status(statusCodes.success.ok)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          statusCodes.success.ok,
          {
            account: response,
            accessToken,
            refreshToken,
          },
          successMessages.loginSuccess
        )
      );
  } catch (error) {
    console.log("error :>> ", error.error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};

export const logoutAccount = async (req, res) => {
  try {
    const { role } = req.body;

    const Model = role === UserTypeEnum.admin ? AdminAuth : UserAuth;

    await Model.findByIdAndUpdate(
      req.auth._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from the document..
        },
      },
      { new: true }
    );

    return res
      .status(statusCodes.success.ok)
      .clearCookie("accessToken", cookiesOptions)
      .clearCookie("refreshToken", cookiesOptions)
      .json(
        new ApiResponse(
          statusCodes.success.ok,
          null,
          successMessages.loggedOutSuccess
        )
      );
  } catch (error) {
    console.log("error :>> ", error.error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};

export const reGenerateAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.missingRefreshToken
      );
    }

    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.expiredRefreshToken
      );
    }

    const { role } = req.body;

    const Model = UserTypeEnum.admin === role ? AdminAuth : UserAuth;

    const authResponse = await Model.findById(decodedToken?._id).select(
      "-password -verificationToken"
    );

    if (
      !(
        authResponse &&
        authResponse.refreshToken &&
        incomingRefreshToken === authResponse.refreshToken
      )
    ) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.invalidRefreshToken
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      Model,
      authResponse._id
    );

    if (!accessToken && !refreshToken) {
      throw new ApiError(
        statusCodes.error.requestTimeout,
        errorMessages.failedToGenerateNewTokens
      );
    }

    return res
      .status(statusCodes.success.created)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          statusCodes.success.created,
          { accessToken, refreshToken },
          successMessages.tokenRegenerated
        )
      );
  } catch (error) {
    console.log("error :>> ", error);
    console.log("error :>> ", error.error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, role } = req.body;

    const Model = role === UserTypeEnum.admin ? AdminAuth : UserAuth;

    const authResponse = await Model.findById(req.auth?._id);

    if (!authResponse) {
      throw new ApiError(
        statusCodes.error.unauthorized,
        errorMessages.unauthorizedRequest
      );
    }

    const isPasswordCorrect = await authResponse.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(
        statusCodes.error.badRequest,
        errorMessages.invalidOldPassword
      );
    }

    authResponse.password = newPassword;

    await authResponse.save({ validateBeforeSave: false });

    //  Send mail
    const mail = await sendMail(MailTypeEnum.changePassword, authResponse);
    console.log("mail.messageId :>> ", mail.messageId);

    return res
      .status(statusCodes.success.ok)
      .json(
        new ApiResponse(
          statusCodes.success.ok,
          {},
          successMessages.passwordChanged
        )
      );
  } catch (error) {
    console.log("error :>> ", error.error);
    res
      .status(error.statusCode || statusCodes.serverError.internalServerError)
      .json(
        error instanceof ApiError
          ? error
          : new ApiError(
              statusCodes.serverError.internalServerError,
              errorMessages.internalServerError
            )
      );
  }
};
