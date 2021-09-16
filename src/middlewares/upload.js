const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

cloudinary.config({
	cloud_name: 'dtlrrlpag',
	api_key: '312965896819612',
	api_secret: 'BVnhkmPHRcK84BZMtzWWnxGDOP4'
})


const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		transformation: [{width: 500, height: 500, crop: 'limit'}],
	}
})

const parser = multer({ storage: storage })

module.exports = parser