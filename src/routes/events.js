const express = require('express')
const {
	create,
	getAll,
	getOne,
	getAllInBusiness,
	update,
	remove,
} = require('../controllers/businessController')
// MIddlewares
const auth = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

const router = express.Router()

// @route POST /businesses
// @desc Save a new business
// @access Business Admins
router.post('/',auth, isAdmin, create)

// @route GET /business
// @desc Get all businesses
// @access Public
router.get('/', getAll)

// @route GET /business
// @desc Get the nearest businesses
// @access Public
router.get('/near', getAllInBusiness)

// @route GET /business/id
// @desc Get a specific business
// @access Public
router.get('/:id', getOne)

// @route Update /business/id
// @desc Update a business
// @access Business Admins
router.patch('/:id',auth, isAdmin, update)

// @route Delete /business/id
// @desc Delete a business
// @access Business Admins
router.delete('/:id', auth, isAdmin, remove)


module.exports = router