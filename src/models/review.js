const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = new Schema({
	content: {
		type: String
	},
	date: {
		type: Date
	},
	madeBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

reviewSchema.index({
	location: '2dsphere'
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review