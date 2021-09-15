const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	date: {
		type: Date,
		required: true
	},
	business: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Business'
	}
})

eventSchema.index({
	location: '2dsphere'
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event