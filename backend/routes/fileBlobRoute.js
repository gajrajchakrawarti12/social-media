import express from 'express';
import multer from 'multer';
import User from '../models/User.js';
import FileBlob from '../models/FileBlob.js';
import Post from '../models/Post.js';
import verifyToken from '../middleware/authentication.js';

const router = express.Router();

// Multer memory storage (storing in memory to save buffer to MongoDB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Upload User Avatar
router.post('/uploadUserAvatar', verifyToken, upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Save file to DB
    const fileBlob = new FileBlob({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
    });

    await fileBlob.save();

    // Update user avatar
    await User.findByIdAndUpdate(req.user._id, { avatar: fileBlob._id });

    return res.status(201).json({ message: 'Avatar uploaded successfully', fileId: fileBlob._id });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete User Avatar
router.delete('/deleteUserAvatar', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.avatar) {
      return res.status(404).json({ message: 'User or avatar not found' });
    }

    await FileBlob.findByIdAndDelete(user.avatar);
    await User.findByIdAndUpdate(req.user._id, { avatar: null });

    return res.status(200).json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload Post Image
router.post('/uploadPostImage', verifyToken, upload.single('file'), async (req, res) => {
  const file = req.file;
  const { postId } = req.body;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required' });
  }

  try {
    const fileBlob = new FileBlob({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
    });

    await fileBlob.save();
    await Post.findByIdAndUpdate(postId, { image: fileBlob._id });

    return res.status(201).json({ message: 'Post image uploaded successfully', fileId: fileBlob._id });
  } catch (error) {
    console.error('Error uploading post image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
