const express = require('express')
const user = require('./user')
const auth = require('./auth')
const business = require('./business')
const admin = require('./admin')

const router = express.Router()

router.use('/auth', auth)
router.use('/business', business)
router.use('/admin', admin)
router.use('/user', user)

module.exports = router