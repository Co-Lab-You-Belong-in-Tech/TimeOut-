const express = require('express');
const router = express.Router();
const {
  createTimeLog,
  updateTimeLog,
  getUserTimeLogs,
  getUserTimeLogsForDate,
} = require('../controllers/timelog.controller');

// Create a timelog
router.post('/', createTimeLog);

// Update a timelog
router.put('/:timelogId', updateTimeLog);

// Get time logs for a user
router.get('/:userId', getUserTimeLogs);

// Get time logs for a specific date
router.get('/:userId/:date', getUserTimeLogsForDate);

module.exports = router;
