const express = require('express');
const { body } = require('express-validator');
const { createGoal, updateGoal, getUserCurrentGoal, saveAndCreateNewGoal, getUserPreviousGoals } = require('../controllers/goal.controller');
const router = express.Router();

// Create a user's goal for the first time only
router.post('/create',
  body("type", "Please provide a type (weekly or monthly)").not().isEmpty(),
  body("target", "Please enter target").not().isEmpty(),
  createGoal);

// Update a user's goal
router.put('/update', updateGoal);

// Get the user's current goal
router.get('/current/:userId', getUserCurrentGoal);

// Save previous goal and create a new goal for the new week or month
router.post('/save-and-create-new', saveAndCreateNewGoal);

// Get the user's previous goals
router.get('/previous/:userId', getUserPreviousGoals);

module.exports = router;
