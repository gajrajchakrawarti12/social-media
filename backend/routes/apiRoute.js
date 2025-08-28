// routes/apiRoute.js
import express from "express";
import userRoute from "./userRoute.js";
import verificationRoute from "./verificationRoute.js";
import postRoute from "./postRoute.js";
import followRoute from "./followRoute.js";
import fileBlobRoute from "./fileBlobRoute.js";

// import fileRoute from "./fileRoute.js";

const router = express.Router();

// Example protected route
router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

router.use("/users", userRoute);
router.use("/verification", verificationRoute);
router.use("/posts", postRoute);
router.use("/follow", followRoute);
router.use("/files", fileBlobRoute);

export default router;