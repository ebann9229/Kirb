
const User = require('../models/users')

const getAll = async (req, res) => {
	const user = await User.find().select('-password')

	res.send(user)
}


const getOne = async (req, res) => {
	const user = await User.findById(req.params.id).select('-password')
	if(!user) return res.status(404).json({user: 'The user was not found'})

	res.send(user)
}

const getProfile = async (req, res) => {
	const user = await User.findById(req.user._id).select('-password').populate('favorites')
	if(!user) return res.status(401).json({general: 'Please login again'})

	res.send(user)
}

module.exports = {
	getAll,
	getOne,
	getProfile
}