/* eslint-disable indent */
const { startSession } = require('mongoose')

const Business = require('../models/businesses')
const User = require('../models/users')
const Review = require('../models/review')


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
		businessHours: req.body.businessHours,
		address: req.body.category,
		category: req.body.category,
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		instagram: req.body.instagram,
		youtube: req.body.youtube
	})

	await business.save()
	res.status(200).json({business: business})
}

const getAll = async (req, res) => {
	let match = {accepted: true}

	if(req.query.category) {
		match.category = req.query.category
	}
	
	const businesses = await Business
			.find()
			.select('-admin -reviews -events')

	res.send(businesses)
}

const getNearest = async (req, res) => {
	const latt = req.query.latt
	const long = req.query.long
	console.log(latt, long)

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

const getOne = async (req, res) => {
	const business = await (await Business.findById(req.params.id)).populate
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
		name: req.body.name,
		description: req.body.description,
		accepted: req.body.accepted
	}, { new: true })

	if(!business) return res.status(404).json({business: 'The business was not found'})

	res.send(business)
}

const uploadPicture = async (req, res) => {
	const files = req.files
	if(!files) return res.status(400).json({image: 'Must provide an image'})

	const coverPhoto = files.cover[0]
	const pictures = files.other.map((pic) => pic.path)
	
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
	const user = User.findById(req.user._id)
	if(!user) return res.status(401).json({general: 'Please login again'})

	const business = Business.findById(req.body.business)
	if(!business) return res.status(404).json({business: 'The bussiness was not found'})

	const review = new Review({
		content: req.body.content,
		madeBy: req.user._id
	})

	try {
		session.startTransaction()
		await review.save()
		await business.review.push(review._id)

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
	const user = User.findById(req.user._id)
	if(!user) return res.status(401).json({general: 'Please login again'})

	const business = Business.findById(req.body.business)
	if(!business) return res.status(404).json({business: 'The business was not found'})

	try {
		session.startTransaction()
		await user.favorite.push(business._id)
		await business.updateOne({$inc: {likeCount: 1}})

		await session.commitTransaction()
		session.endSession()
	} catch (err) {
		await session.abortTransaction()
		session.endSession()
		console.log(err)
		res.send('Error')
	}
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
	like
}