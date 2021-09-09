const mongoose = require('mongoose')

const businessSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
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
		required: true,
		minlength: 10,
		maxlength: 10
	},
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
	ratings: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Rating'
	}],
	// events: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'Event'
	// }],
	categories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	}],
	accepted: {
		type: Boolean
	},
	coverPhoto: {
		type: String
	},
	pictures: {
		type: [String]
	}
})

businessSchema.index({
	location: '2dsphere'
})

const Business = mongoose.model('Business', businessSchema)

module.exports = Business