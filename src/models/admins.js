const mongoose = require('mongoose')
const { Schema } = mongoose
const jwt = require('jsonwebtoken')
require('dotenv').config()

const adminSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	lastName: {
		type: String,
		required: true,
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
	},
	role: {
		type: String,
		enum: ['business_admin', 'super_admin'],
		default: 'business_admin'
	}
})

adminSchema.methods.generateAuthToken = function () {
	// eslint-disable-next-line no-undef
	const token = jwt.sign({isAdmin: true,_id: this._id, role: this.role}, process.env.KIRB_JWTPRIVATEKEY)
	return token
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin