const bcrypt = require('bcrypt')
const crypto = require('crypto')

const mail = require('../utils/mail')
const Admin = require('../models/admins')

const login = async (req, res) => {
	const admin = await Admin.findOne({'email': req.body.email})
	if(!admin) return res.status(401).json({general: 'Incorrect email or password'})

	const match = await bcrypt.compare(req.body.password, admin.password)
	if(!match) return res.status(401).json({general: 'Incorrect email or password'})

	const token = admin.generateAuthToken()
	return res.status(200).json({token: token})
}

const register = async (req, res) => {
	let admin = await Admin.findOne({email: req.body.email})
	if(admin) return res.status(400).json({username: 'The email is already registered'})

	admin = new Admin({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password,
		email: req.body.email,
	})

	const salt = await bcrypt.genSalt(10)
	admin.password = await bcrypt.hash(admin.password, salt)
	await admin.save()

	const token = admin.generateAuthToken()
	return res.status(200).json({token: token})
}

const forgotPassword = async (req, res) => {
	const token = crypto.randomBytes(20).toString('hex')
	// eslint-disable-next-line no-unused-vars
	const admin = await Admin.findOneAndUpdate({email: req.body.email}, {
		resetPasswordToken: token,
		resetPasswordExpiry: Date.now() + 86400000
	})

	if(!admin) return res.send('A reset token is sent to your email. It expires in one day')

	await mail(token, admin.email).catch(console.error)
	res.send('A reset token is sent to your email. It expires in one day')
}

const resetPassword = async (req, res) => {
	const admin = await Admin.findOne({ 
		resetPasswordToken: req.body.token,
		resetPasswordExpiry: {
			$gt: Date.now()
		}
	})
	if(!admin) return res.status(400).send('password reset token is invalid or has been expired')

	const salt = await bcrypt.genSalt(10)
	const newPassword = await bcrypt.hash(req.body.password, salt)
	await admin.update({ 
		password: newPassword, 
		resetPasswordToken: null, 
		resetPasswordExpiry: null
	})
		
}

module.exports = {
	login,
	register,
	forgotPassword,
	resetPassword
}