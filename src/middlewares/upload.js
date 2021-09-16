const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary')

cloudinary.config({
	cloud_name: 'dtlrrlpag',
	api_key: '312965896896819612',
	api_secret: 'BVnhkmPHRcK84BZMtzWWnxGDOP4'
})


const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	allowedFormats: ['jpeg', 'jpg', 'png'],
	transformation: [{width: 500, height: 500, crop: 'limit'}],
	folder: 'Business'
})

const parser = multer({ storage: storage })

module.exports = parser