const express = require('express');
const { body } = require("express-validator");
const router = express.Router();
const {
  createTimeLog,
  updateTimeLog,
  getUserTimeLogs,
  getUserTimeLogsByDate,
} = require('../controllers/timelog.controller');

// Create a timelog
router.post('/',
  body("userId", "Please enter userId").not().isEmpty(),
  body("date", "Please enter a date").not().isEmpty(),
  body("timeSpent", "Please enter a valid number for timeSpent").isNumeric(),
  createTimeLog);

// Update a timelog
router.put('/:userId', updateTimeLog);

// Get time logs for a specific date
router.get('/:userId/:date', getUserTimeLogsByDate);

// Get time logs for a user
router.get('/:userId', getUserTimeLogs);


module.exports = router;
