/* eslint-disable no-undef */
const express = require('express')
const jwt = require('jsonwebtoken')

const user = require('./user')
const auth = require('./auth')
const business = require('./business')
const admin = require('./admin')

const router = express.Router()

router.use('/auth', auth)
router.use('/business', business)
router.use('/admin', admin)
router.use('/user', user)
router.post('/login', async (req, res) => {
	let token
	if(req.body.username === process.env.SUPERADMIN_USERNAME && req.body.password === process.env.SUPERADMIN_PASSWORD){
		token = jwt.sign({superAdmin: true}, process.env.KIRB_JWTPRIVATEKEY)
		return res.status(200).json({token: token})
	} 
	res.status(401).json({general: 'Incorrect user name and password'})
	
})

module.exports = router