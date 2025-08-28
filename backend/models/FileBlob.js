import mongoose from "mongoose";

const fileBlobSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
});

const FileBlob = mongoose.model("FileBlob", fileBlobSchema);

export default FileBlob;
