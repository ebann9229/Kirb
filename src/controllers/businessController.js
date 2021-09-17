/* eslint-disable indent */
const { startSession } = require('mongoose')

const Business = require('../models/businesses')
const User = require('../models/users')
const Review = require('../models/review')
const Event = require('../models/events')

const create = async (req, res) => {
	let business = await Business.findOne({name: req.body.name})
	if(business) return res.status(400).json({name: 'A business with the same name has already been registered'})

	const location = [req.body.longitude, req.body.latitude]
	business = new Business({
		name: req.body.name,
		location: {
			coordinates: location
		},
		admin: req.user._id,
		description: req.body.description,
		phoneNumber: req.body.phoneNumber,
		websiteUrl: req.body.websiteUrl,
		address: req.body.address,
		category: req.body.category,
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		instagram: req.body.instagram,
		youtube: req.body.youtube
	})

	await business.save()
	res.status(200).json({business: business})
}

const getAllSuperAdmin = async (req, res) => {
	const businesses = await Business.find()

	res.send(businesses)
}
const getAll = async (req, res) => {
	let match = {accepted: true}

	if(req.query.category) {
		match.category = req.query.category
	}
	
	const businesses = await Business
			.find(match)
			.select('-admin -reviews -events')

	res.send(businesses)
}

const getNearest = async (req, res) => {
	const latt = req.query.latt
	const long = req.query.long

	const businesses = await Business.aggregate([
		{ '$geoNear': {
			'near': {
				'type': 'Point',
				'coordinates': [long, latt]
			},
			'distanceField': 'distance',
			'spherical': true
		}}
	])

	if(!businesses) return res.status(404).json({business: 'No nearby businesses found'})

	res.send(businesses)
}

const getMyBusiness = async (req, res) => {
	const business = await Business
		.findOne({admin: req.user._id})
		.populate('events', 'name description')
		.populate({
			path: 'reviews',
			populate: ({
				path: 'madeBy',
				model: 'User',
				select: 'username email'
			})
		})
	if (!business) return res.status(404).json({business: 'You have no business'})

	res.send(business)
}

const getOne = async (req, res) => {
	const business = await Business
		.findById(req.params.id)
		.populate('events', 'name description')
		.populate({
			path: 'reviews',
			populate: ({
				path: 'madeBy',
				model: 'User',
				select: 'username email'
			})
		})
	if(!business) return res.status(404).json({business: 'The business was not found'})

	res.send(business)
}

const remove = async (req, res) => {
	const business = await Business.findByIdAndDelete(req.params.id)
	if(!business) return res.status(404).json({business: 'The business was not found'})

	res.send('Deleted successfully')
}

const update = async (req, res) => {
	const business = await Business.findByIdAndUpdate(req.params.id, {
		description: req.body.description,
		phoneNumber: req.body.phoneNumber,
		websiteUrl: req.body.websiteUrl,
		address: req.body.address,
		category: req.body.category,
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		instagram: req.body.instagram,
		youtube: req.body.youtube
	}, { new: true })

	if(!business) return res.status(404).json({business: 'The business was not found'})

	res.send(business)
}

const uploadPicture = async (req, res) => {
	console.log('reached here')
	const files = req.files
	if(!files) return res.status(400).json({image: 'Must provide an image'})

	const coverPhoto = files.cover[0]
	let pictures
	if(files.other){
		pictures = files.other.map((pic) => pic.path)
	}
	
	// Check if the user that sent the request is the admin of the business
	const business = await Business.findById(req.params.id)
	if(!business) return res.status(404).json({business: 'The business was not found'})
	if(req.user._id != business.admin) {
		res.send('Access Denied')
	}

	await business.updateOne({coverPhoto: coverPhoto.path, pictures: pictures})
	res.send(business)
}

const review = async (req, res) => {
	const session = await startSession()
	const user = await User.findById(req.user._id)
	if(!user) return res.status(401).json({general: 'Please login again'})

	const business = await Business.findById(req.body.business)
	if(!business) return res.status(404).json({business: 'The bussiness was not found'})

	const review = new Review({
		content: req.body.content,
		madeBy: req.user._id
	})

	try {
		session.startTransaction()
		await review.save()
		business.reviews.push(review._id)
		await business.save()

		await session.commitTransaction()
		session.endSession()
		res.send('Success')
	} catch (err) {
		await session.abortTransaction()
		session.endSession()
		console.log(err)
		res.send('Error')
	}

}

const like = async (req, res) => {
	const session = await startSession()
	const user = await User.findById(req.user._id)
	if(!user) return res.status(401).json({general: 'Please login again'})

	if(user.favorites.indexOf(req.body.business) > -1) return res.status(400).json({general: 'You already liked this business'})

	const business = await Business.findById(req.body.business)
	if(!business) return res.status(404).json({business: 'The business was not found'})

	try {
		session.startTransaction()
		user.favorites.push(business._id)
		await user.save()
		await business.updateOne({$inc: {likeCount: 1}})

		await session.commitTransaction()
		session.endSession()
		res.send('Success')
	} catch (err) {
		await session.abortTransaction()
		session.endSession()
		console.log(err)
		res.send('Error')
	}
}

const createEvent = async (req, res) => {
	const session = await startSession()

	const business = await Business.findById(req.body.business)
	if(!business) return res.status(404).json({business: 'The bussiness was not found'})

	const event = new Event({
		name: req.body.name,
		description: req.body.description,
		date: req.body.date
	})
	console.log(business)
	try {
		session.startTransaction()
		await event.save()
		business.events.push(event._id)
		await business.save()

		await session.commitTransaction()
		session.endSession()
		res.send('Success')
	} catch (err) {
		await session.abortTransaction()
		session.endSession()
		console.log(err)
		res.send('Error')
	}

}

const approve = async (req, res) => {
	const business = await Business.findByIdAndUpdate(req.params.id, {
		accepted: true
	}, { new: true})

	if(!business) return res.status(404).json({business: 'The business was not found'})

	res.send(business)
}

module.exports = {
	create,
	getAll,
	getOne,
	getNearest,
	update,
	remove,
	uploadPicture,
	review,
	like,
	createEvent,
	approve,
	getMyBusiness,
	getAllSuperAdmin
}