import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  deviceInfo: { type: String },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('RefreshToken', refreshTokenSchema);
