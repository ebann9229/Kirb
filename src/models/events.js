const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema({
	description: {
		type: String
	},
	date: {
		type: Date
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
	}
})

eventSchema.index({
	location: '2dsphere'
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event