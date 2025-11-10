import mongoose from "mongoose";
import { SALT, UserTypeEnum } from "../constants/common.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminAuthSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    businessOwner: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false,
      default: null,
    },
    verificationToken: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: UserTypeEnum,
      default: UserTypeEnum.admin,
    },
    isVerified: {
      type: Boolean,
      require: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

adminAuthSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, SALT);
  }
  next();
});

adminAuthSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminAuthSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

adminAuthSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const AdminAuth = mongoose.model("Admin", adminAuthSchema);
