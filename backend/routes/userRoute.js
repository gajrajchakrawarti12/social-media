import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/authentication.js';

const router = express.Router();

// Example protected route

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ message: 'User list fetched successfully', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: `Welcome to the dashboard, user ${userId}`, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/following', verifyToken, async (req, res) => {
  const followingIds = req.body.following;
  console.log(req.body);
  console.log(followingIds);
  

  if (!Array.isArray(followingIds)) {
    return res.status(400).json({ message: 'Invalid following data' });
  }

  try {
    const user = await User.findById(req.user._id);
    console.log(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = followingIds;
    await user.save();

    return res.json({ message: 'Following updated successfully', following: user.following });
  } catch (error) {
    console.error('Error updating following:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/:username', verifyToken, async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOneAndDelete({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: `User ${username} deleted successfully`, user });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;