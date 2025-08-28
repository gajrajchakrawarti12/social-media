import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  follower: { type: String, ref: "User", required: true },
  following: { type: String, ref: "User", required: true }
}, { timestamps: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
