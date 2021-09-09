const mongoose = require('mongoose')
require('dotenv').config()

module.exports = function () {
	// eslint-disable-next-line no-undef
	const db = process.env.DB
	mongoose.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => console.log(`Connected to ${db}...`))
}