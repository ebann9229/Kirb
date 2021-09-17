module.exports = function (req, res, next) {
	console.log(req.user)
	if (!req.user.superAdmin) return res.status(403).send('Access Denied')
	next()
}