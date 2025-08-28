import express from 'express';
import Follow from '../models/Follow.js';
import verifyToken from '../middleware/authentication.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { following } = req.body;
  const { _id } = req.user;

  if (!following) {
    return res.status(400).json({ message: 'Following ID is required' });
  }

  try {
    const follow = new Follow({ follower: _id, following });
    await follow.save();
    await User.findByIdAndUpdate(_id, { $inc: { following: 1 } });
    await User.findByIdAndUpdate(following, { $inc: { followers: 1 } });
    return res.status(201).json({ message: 'Follow relationship created', follow });
  } catch (error) {
    console.error('Error creating follow relationship:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete("/unfollow", verifyToken, async (req, res) => {
  const { following } = req.body;
  const { _id } = req.user;

  if (!following) {
    return res.status(400).json({ message: 'Following ID is required' });
  }

  try {
    const follow = await Follow.findOneAndDelete({ follower: _id, following });
    if (!follow) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }

    await User.findByIdAndUpdate(_id, { $inc: { following: -1 } });
    await User.findByIdAndUpdate(following, { $inc: { followers: -1 } });
    return res.status(200).json({ message: 'Follow relationship deleted', follow });
  } catch (error) {
    console.error('Error deleting follow relationship:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/followers/', verifyToken, async (req, res) => {
  const { _id } = req.user;

  try {
    const followers = await Follow.find({ following: _id }).populate('follower', 'username avatar');
    return res.status(200).json({ followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/following', verifyToken, async (req, res) => {
  const { _id } = req.user;

  try {
    const following = await Follow.find({ follower: _id }).populate('following', 'username avatar');
    return res.status(200).json({ following });
  } catch (error) {
    console.error('Error fetching following:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
