const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
	const token = req.header('Authorization')

	if (!token) return res.status(401).send('Access denied. No token provided')
	try {
		// eslint-disable-next-line no-undef
		const decode = jwt.verify(token, process.env.KIRB_JWTPRIVATEKEY)
		req.user = decode
		next()
	}
	catch (ex) {
		res.status(400).send('Invalid token.')
	}
}