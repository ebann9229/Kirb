const mongoose = require('mongoose')
const { Schema } = mongoose
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
		trim: true,
		lowercase: true,
		unique: 1
	},
	email:{
		type: String,
		trim: true,
		lowercase: true,
	},
	password:{
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024
	},
	favorites: {
		type: [Schema.Types.ObjectId],
		ref: 'Business'
	}
	
})

userSchema.methods.generateAuthToken = function () {
	// eslint-disable-next-line no-undef
	const token = jwt.sign({_id: this.id}, process.env.KIRB_JWTPRIVATEKEY)
	return token
}

const User = mongoose.model('User', userSchema)

module.exports = User