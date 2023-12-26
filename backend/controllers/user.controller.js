const User = require('../models/user');

// Create a new user or retrieve existing user
const createUser = async (req, res) => {
  try {
    const { deviceId } = req.body;

    // Check if a user with the provided deviceId already exists
    let user = await User.findOne({ deviceId });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({ deviceId });
      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUserDetails
}

