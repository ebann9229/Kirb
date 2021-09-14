/* eslint-disable indent */
const Fawn = require('fawn')

const Business = require('../models/businesses')
const User = require('../models/users')
const Review = require('../models/review')

const create = async (req, res) => {
	let business = await Business.findOne({name: req.body.name})
	if(business) return res.status(400).json({name: 'A business with the same name has already been registered'})

	business = new Business({
		name: req.body.name,
		location: {
			coordinates: req.body.location
		},
		admin: req.user._id,
		description: req.body.description,
		phoneNumber: req.body.phoneNumber,
		websiteUrl: req.body.websiteUrl,
		businessHours: req.body.businessHours,
		city: req.body.city,
		street: req.body.street,
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
	let sort = {}

	if(req.query.category) {
		match.category = req.query.category
	}
	if(req.query.sortBy) {
		const part = req.query.sortBy.split(':')
		sort = part[1] === 'desc' ? '-' + part[0] : part[0]
	}

	const businesses = await Business
			.find(match)
			.select('-admin')
			.sort(sort)
			.limit(parseInt(req.query.limit || 0))
			.skip(parseInt(req.query.skip || 0))

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
	const business = await Business.findById(req.params.id)
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
	const user = User.findById(req.user._id)
	if(!user) return res.status(401).json({general: 'Please login again'})

	const business = Business.findById(req.body.business)
	if(!business) return res.status(404).json({business: 'The bussiness was not found'})

	const review = new Review({
		content: req.body.content,
		madeBy: req.user._id
	})

	new Fawn.Task()
		.update('businesses', {_id: business._id}, {
			$push: { reviews: review._id}
		})
		.save('reviews', review)
		.run()

	res.send('Success')

}


module.exports = {
	create,
	getAll,
	getOne,
	getNearest,
	update,
	remove,
	uploadPicture,
	review
}