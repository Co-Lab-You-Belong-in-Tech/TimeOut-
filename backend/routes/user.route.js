const express = require("express");
const router = express.Router();
const { createUser, getUserDetails } = require("../controllers/user.controller");

// Create user
router.post('/', createUser);

// Get user details
router.get('/:userId', getUserDetails);

module.exports = router;