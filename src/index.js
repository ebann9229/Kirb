const express = require('express')
const cors = require('cors')
const compression = require('compression')
require('dotenv').config()

const routes = require('./routes/index')
const error = require('./middlewares/error')
const db = require('./startup/db')
const config = require('./startup/config')

const app = express()


app.use(cors())
app.use(express.json())
app.use(compression())
app.use(routes)
app.use(error)
db()

config()

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})

module.exports = server