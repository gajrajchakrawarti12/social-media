import express from 'express';
import Post from '../models/Post.js';
import FileBlob from '../models/FileBlob.js';
import multer from 'multer';
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


router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log(req.body, req.file);
    const file = req.file;
    if (!file) {
      const post = new Post({ ...req.body, image: null });
      await post.save();
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const fileBlob = new FileBlob({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
    });
    await fileBlob.save();
    const post = new Post({ ...req.body, image: fileBlob._id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username avatar');
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: { userId: userId } } },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post liked", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/unlike', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: { userId: userId } } },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post unliked", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/comment', verifyToken, async (req, res) => {
  try {
    const content = req.body;

    if (!content) return res.status(400).json({ error: "Comment content is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      userId: req.user._id,
      content: content.content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/unComment', verifyToken, async (req, res) => {
  try {
    const { commentId } = req.body;
    if (!commentId) return res.status(400).json({ error: "Comment ID is required" });

    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { comments: { _id: commentId, userId: req.user._id } }
    });

    res.status(200).json({ message: "Comment removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await FileBlob.deleteMany({ _id: { $in: post.image } });
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
