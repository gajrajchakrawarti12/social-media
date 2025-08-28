import express from 'express';
import FileBlob from '../models/FileBlob.js';

const router = express.Router();
router.get("/:id", async(req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-store" // prevent 304 cache issues
  });

  try {
    const fileBlob = await FileBlob.findById(req.params.id);

    if (!fileBlob) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", fileBlob.mimetype);
    res.send(fileBlob.data);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
