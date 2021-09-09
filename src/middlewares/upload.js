const multer = require('multer')

const parser = multer({dest: './uploads'})

module.exports = parser