const express = require('express');
const { getWeeklyStats, getMonthlyStats, getAllStats } = require('../controllers/stats.controller');
const router = express.Router();

// All Stats
router.get('/:userId/:date?', getAllStats);


module.exports = router;
