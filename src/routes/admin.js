const express = require('express')

const router = new express.Router()
const {
	loginController,
	registerController
} = require('../controllers/adminController')

// @route POST /admin/login
// @desc Authenticate an admin
// @access Public
router.post('/login', loginController)

// @route POST /admin
// @desc Register an admin
// @access Public
router.post('/', registerController)

module.exports = router