const mongoose = require('mongoose')
const { Schema } = mongoose
const jwt = require('jsonwebtoken')
require('dotenv').config()

const adminSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		maxlength: 20,
		trim: true,
		lowercase: true,
	},
	lastName: {
		type: String,
		required: true,
		maxlength: 20,
		trim: true,
		lowercase: true,
	},
	email:{
		type: String,
		trim: true,
		lowercase: true,
		unique: true
	},
	password:{
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024
	},
	resetPasswordToken: {
		type: String,
		default: null
	},
	resetPasswordExpiry: {
		type: String,
		default: null
	}
})

adminSchema.methods.generateAuthToken = function () {
	// eslint-disable-next-line no-undef
	const token = jwt.sign({isAdmin: true,_id: this.id}, process.env.KIRB_JWTPRIVATEKEY)
	return token
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin