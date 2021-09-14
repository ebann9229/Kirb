const express = require('express')

const router = new express.Router()
const {
	login,
	register,
	forgotPassword
} = require('../controllers/adminController')

// @route POST /admin/login
// @desc Authenticate an admin
// @access Public
router.post('/login', login)

// @route POST /admin
// @desc Register an admin
// @access Public
router.post('/', register)

// @route POST /forgot-password
// @desc Send reset token
// @access Public
router.post('/forgot-password', forgotPassword)

module.exports = router