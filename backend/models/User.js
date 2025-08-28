import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple nulls
      trim: true,
      lowercase: true,
      required: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationExpires: {
      type: Date,
      default: null,
    },
    emailVerifiedDate: {
      type: Date,
      default: null,
    },
    following: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);