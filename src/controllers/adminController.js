const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

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

	res.send('A reset token is sent to your email. It expires in one hour')

	let testAccount = await nodemailer.createTestAccount()

	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		}
	})

	let info = await transporter.sendMail({
		from: ' "Christian" <kirb@test.com>',
		to: 'eyobmuktar4@gmail.com',
		subject: 'Link To Reset Password',
		text: `Please click the following link or paste this into your browser to complete the process
				http://localhost:3002/reset/${token}`
	})

	console.log(info.messageId)
}

module.exports = {
	login,
	register,
	forgotPassword
}