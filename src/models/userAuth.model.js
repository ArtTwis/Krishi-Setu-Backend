import mongoose from "mongoose";
import { SALT, UserTypeEnum } from "../constants/common.js";
import bcrypt from "bcrypt";

const userAuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    isVerified: {
      type: Boolean,
      require: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      enum: UserTypeEnum,
      default: UserTypeEnum.user,
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

userAuthSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, SALT);
  }
  next();
});

export const UserAuth = mongoose.model("User", userAuthSchema);
