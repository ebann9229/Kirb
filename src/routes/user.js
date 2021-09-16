const express = require('express')

const router = new express.Router()
const {
	getAll,
	getOne,
	getProfile
} = require('../controllers/userController')
const auth = require('../middlewares/auth')

// @route POST /users
// @desc Get all users
// @access Super admin
router.get('/', getAll)

// @route POST /users/id
// @desc Get a user
// @access Super admin
router.post('/:id', getOne)

// @route POST /users/profile
// @desc Get a user profile
// @access User
router.get('/profile', auth, getProfile)

module.exports = router