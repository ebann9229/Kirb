module.exports = function (req, res, next) {
	if (req.user.role !== 'super_admin') return res.status(403).send('Access Denied')
	next()
}