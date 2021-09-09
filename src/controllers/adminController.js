const bcrypt = require('bcrypt')

const Admin = require('../models/admins')

const loginController = async (req, res) => {
	const admin = await Admin.findOne({'email': req.body.email})
	if(!admin) return res.status(401).json({general: 'Incorrect email or password'})

	const match = await bcrypt.compare(req.body.password, admin.password)
	if(!match) return res.status(401).json({general: 'Incorrect email or password'})

	const token = admin.generateAuthToken()
	return res.status(200).json({token: token})
}

const registerController = async (req, res) => {
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

module.exports = {
	loginController,
	registerController
}