const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { createUser, getUserDetails } = require("../controllers/user.controller");

// Create user
router.post('/',
  body("deviceId", "Please enter a deviceId to create a user").not().isEmpty(),
  body("timezone", "Please enter the timezone").not().isEmpty(),
  createUser);

// Get user details
router.get('/:id', getUserDetails);

module.exports = router;