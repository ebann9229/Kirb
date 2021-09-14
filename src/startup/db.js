const mongoose = require('mongoose')
require('dotenv').config()
// const Fawn = require('fawn')
module.exports = function () {
	// eslint-disable-next-line no-undef
	const db = process.env.DB
	console.log(db)
	mongoose.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => console.log(`Connected to ${db}...`))

	// Fawn.init(mongoose)
}