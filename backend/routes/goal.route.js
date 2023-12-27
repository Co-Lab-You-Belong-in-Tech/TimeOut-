const express = require('express');
const { createGoal, updateGoal, getUserCurrentGoal, saveAndCreateNewGoal, getUserPreviousGoals } = require('../controllers/goal.controller');
const router = express.Router();

// Create a user's goal for the first time only
router.post('/create', createGoal);

// Update a user's goal
router.put('/update', updateGoal);

// Get the user's current goal
router.get('/current/:userId', getUserCurrentGoal);

// Save previous goal and create a new goal for the new week or month
router.post('/save-and-create-new', saveAndCreateNewGoal);

// Get the user's previous goals
router.get('/previous/:userId', getUserPreviousGoals);

module.exports = router;
