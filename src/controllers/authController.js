const bcrypt = require('bcrypt')

const User = require('../models/users')

const login = async (req, res) => {
	const user = await User.findOne({'username': req.body.username})
	if(!user) return res.status(401).json({general: 'Incorrect username or password'})

	const match = await bcrypt.compare(req.body.password, user.password)
	if(!match) return res.status(401).json({general: 'Incorrect username or password'})

	const token = user.generateAuthToken()
	return res.status(200).json({token: token})
}

const register = async (req, res) => {
	let user = await User.findOne({username: req.body.username})
	if(user) return res.status(400).json({username: 'The username is already registered'})

	user = new User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
	})

	const salt = await bcrypt.genSalt(10)
	user.password = await bcrypt.hash(user.password, salt)
	await user.save()

	const token = user.generateAuthToken()
	return res.status(200).json({token: token})
}

module.exports = {
	login,
	register
}