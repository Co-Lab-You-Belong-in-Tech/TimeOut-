const express = require('express');
const { getWeeklyStats, getMonthlyStats } = require('../controllers/stats.controller');
const router = express.Router();

// Weekly Stats
router.get('/weekly/:userId/:date', getWeeklyStats);

// Monthly Stats
router.get('/monthly/:userId/:date', getMonthlyStats);

module.exports = router;
