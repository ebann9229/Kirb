const express = require('express')

const router = new express.Router()
const {
	login,
	register
} = require('../controllers/authController')

// @route POST /auth
// @desc Authenticate a user
// @access Public
router.post('/login', login)

// @route POST /auth
// @desc Register a user
// @access Public
router.post('/', register)

module.exports = router