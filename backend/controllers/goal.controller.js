const Goal = require('../models/Goal.model');
const User = require('../models/User.model');
const { calculateStartDate } = require('../helpers/goal.helper');
const { validationResult } = require('express-validator');

// Create a user's goal for the first time only 
// (After this, each week or month, the saveAndCreateNewGoal controller will create a new goal based on the details of the previous one)
const createGoal = async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { userId, type, target } = req.body;

    // Find the user to check if they already have a goal
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has a goal
    let goal = await Goal.findOne({ userId });

    if (goal) {
      return res.status(400).json({ message: 'User already has a goal. Use updateGoal for modifications.' });
    }

    // If no goal exists, create a new one
    goal = new Goal({ userId, type, target });
    // Set the start date based on the type (weekly or monthly)
    goal.startDate = calculateStartDate(type);
    await goal.save();

    res.status(201).json({ goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user's current goal
const updateGoal = async (req, res) => {
  try {
    const { userId, type, target } = req.body;

    // Find the user to check if they already have a goal
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has a goal
    let currentGoal = await Goal.findOne({ userId }).sort({ createdAt: -1 });

    if (!currentGoal) {
      return res.status(404).json({ message: 'User does not have a goal. Use createGoal to create one.' });
    }

    // Check if the goal type is changing
    if (currentGoal.type !== type) {
      // Update the goal based on the type change
      let progress = await handleGoalTypeChange(currentGoal, userId, type, target);
      currentGoal.progress = progress;
    }

    // Update the goal details
    currentGoal.type = type;
    currentGoal.target = target;

    await currentGoal.save();

    res.status(200).json({ currentGoal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get the user's current goal
const getUserCurrentGoal = async (req, res) => {
  try {
    const { userId } = req.params;

    // Returns the newest goal in the list
    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });

    if (!goal) {
      return res.status(200).json({ goal: {} });
    }

    res.status(200).json({ goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save previous goal and create a new goal for the new week or month
const saveAndCreateNewGoal = async (req, res) => {
  try {
    const { userId, progress } = req.body;

    // Find the user's current goal in the database
    let currentGoal = await Goal.findOne({ userId }).sort({ createdAt: -1 });

    if (!currentGoal) {
      return res.status(404).json({ message: 'Goal not found for the user' });
    }

    // Save the current week's or month's progress as previous goal
    const previousGoal = new Goal({
      userId: currentGoal.userId,
      type: currentGoal.type,
      target: currentGoal.target,
      startDate: currentGoal.startDate,
      endDate: new Date(), // Set end date as the current date
      progress: progress,
    });

    await previousGoal.save();

    // Create a new goal for the upcoming week or month based on details of prev goal
    const newGoal = new Goal({ userId, type: currentGoal.type, target: currentGoal.target });
    newGoal.startDate = calculateStartDate(currentGoal.type);
    await newGoal.save();

    res.status(200).json({ previousGoal, newGoal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the user's previous goals
const getUserPreviousGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    // Will only return goals which have an endDate (will not return current goal since no endDate yet)
    const previousGoals = await Goal.find({ userId, endDate: { $exists: true } });

    res.status(200).json({ previousGoals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGoal,
  updateGoal,
  getUserCurrentGoal,
  saveAndCreateNewGoal,
  getUserPreviousGoals
}
