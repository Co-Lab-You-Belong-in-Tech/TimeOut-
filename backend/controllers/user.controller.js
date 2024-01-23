const { validationResult } = require('express-validator');
const User = require('../models/User.model');

// Create a new user or retrieve existing user
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { deviceId, timezone, playerId } = req.body;

    // Check if a user with the provided deviceId already exists
    let user = await User.findOne({ deviceId });

    // If the user already exists, return the existing user
    if (user) {
      return res.status(200).json({ user });
    }

    // If the user doesn't exist, create a new user
    user = new User({ deviceId, timezone, playerId });
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

