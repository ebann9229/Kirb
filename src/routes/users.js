const express = require('express')

const router = new express.Router()
const {
	loginController,
	registerController
} = require('../controllers/userController')

// @route POST /auth
// @desc Authenticate a user
// @access Public
router.post('/login', loginController)

// @route POST /auth
// @desc Register a user
// @access Public
router.post('/', registerController)

module.exports = router