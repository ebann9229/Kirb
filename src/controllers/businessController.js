/* eslint-disable indent */
const Business = require('../models/businesses')

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
		websiteUrl: req.body.websiteUrl
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
	
}
module.exports = {
	create,
	getAll,
	getOne,
	getNearest,
	update,
	remove,
	uploadPicture
}