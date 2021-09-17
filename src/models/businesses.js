const mongoose = require('mongoose')

const businessSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		lowercase: true,
		unique: 1
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Admin'
	},
	description:{
		type: String,
		lowercase: true,
	},
	phoneNumber:{
		type: String,
		
	},
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	}],
	websiteUrl: {
		type: String
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	rating: {
		type: Number
	},
	category: {
		type: String,
	},
	accepted: {
		type: Boolean,
	},
	coverPhoto: {
		type: String
	},
	pictures: {
		type: [String]
	},
	address: {
		type: String
	},
	facebook: {
		type: String
	},
	twitter: {
		type: String
	},
	youtube: {
		type: String
	},
	instagram: {
		type: String
	},
	businessHours: {
		type: String
	},
	likeCount: {
		type: Number
	}
})

businessSchema.index({
	location: '2dsphere'
})

const Business = mongoose.model('Business', businessSchema)

module.exports = Business