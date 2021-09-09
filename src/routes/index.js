const express = require('express')
const user = require('./users')
const business = require('./business')
const admin = require('./admin')

const router = express.Router()

router.use('/auth', user)
router.use('/business', business)
router.use('/admin', admin)

module.exports = router