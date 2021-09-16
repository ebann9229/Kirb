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
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	}
})

eventSchema.index({
	location: '2dsphere'
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event