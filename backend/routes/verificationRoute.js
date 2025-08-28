import express from "express";
import crypto from "crypto";
import User from "../models/User.js"; // Assuming you have a User model
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/emailService.js"; // Assuming you have an email service utility

const router = express.Router();

router.post("/email/1a1caca032559b3d1db9", async (req, res) => {
  const access_token = req.cookies.access_token;
  if (!access_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.sub).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate verification token
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationExpires = Date.now() + 1000 * 60 * 10; // 10 minutes

  await user.save();

  // Send verification email (pseudo-code)
  await sendVerificationEmail(user.email, token, user.fullName);

  res.json({ message: "Verification email sent" });
});

router.get("/email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.redirect(`${process.env.CLIENT_URL}/email-verification-failed`);
    return;
  }

  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.redirect(`${process.env.CLIENT_URL}/email-verification-failed`);
    return;
  }

  user.emailVerified = true;
  user.emailVerifiedDate = Date.now();
  user.verificationToken = null;
  user.verificationExpires = null;

  await user.save();

  res.redirect(`${process.env.CLIENT_URL}/email-verified`);
});

export default router;