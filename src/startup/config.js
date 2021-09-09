require('dotenv').config()

module.exports = function () {
	// eslint-disable-next-line no-undef
	if(!process.env.KIRB_JWTPRIVATEKEY){
		throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
	}
}