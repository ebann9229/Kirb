const express = require('express')
const {
	create,
	getAll,
	getNearest,
	getOne,
	update,
	remove,
	uploadPicture,
	createEvent,
	like,
	review,
	approve,
	getMyBusiness
} = require('../controllers/businessController')
// MIddlewares
const auth = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')
const isSuperAdmin = require('../middlewares/isSuperAdmin')
const parser = require('../middlewares/upload')

const router = express.Router()

// @route POST /businesses
// @desc Save a new business
// @access Business Admins
router.post('/', create)

// @route GET /business
// @desc Get all businesses
// @access Public
router.get('/', getAll)

// @route GET /business
// @desc Get the nearest businesses
// @access Public
router.get('/near', getNearest)

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

// @route Patch /business/upload/id
// @desc Add a business photo
// @access Business Admins
router.patch('/upload/:id', parser.fields([{name: 'cover', max: 1}, {name: 'other', max: 20}]), uploadPicture)

// @route Post /business/event
// @desc Add a business event
// @access Business Admins
router.post('/event',  createEvent)

router.post('/like',auth, like)
router.post('/review',auth, review)
router.patch('/approve/:id',auth, isSuperAdmin, approve)
router.get('/own', auth, isAdmin, getMyBusiness )

module.exports = router