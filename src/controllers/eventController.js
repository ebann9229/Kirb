const Business = require('../models/businesses')
const Event = require('../models/event')



const create = async (req, res) => {
	
	let event = new Event({
		name: req.body.name,
		description: req.body.description,
		business: req.body.business,
		date: req.body.date
	})

	await event.save()
	res.status(200).json({event})
}

const getAll = async (req, res) => {
	const events = Event.find()
	res.send(events)
}

const getAllInBusiness = async (req, res) => {
	

	const events = await Event.find({business: req.query.business})


	res.send(events)
}

const getOne = async (req, res) => {
	const event = await Event.findById(req.params.id)
	if(!event) return res.status(404).json({event: 'The event was not found'})

	res.send(event)
}

const remove = async (req, res) => {
	const event = await Event.findByIdAndDelete(req.params.id)
	if(!event) return res.status(404).json({event: 'The event was not found'})

	res.send('Deleted successfully')
}

const update = async (req, res) => {
	const event = await Business.findByIdAndUpdate(req.params.id, {
		name: req.body.name,
		description: req.body.description,
		date: req.body.date
	}, { new: true })

	if(!event) return res.status(404).json({event: 'The event was not found'})

	res.send(event)
}



module.exports = {
	create,
	getAll,
	getOne,
	getAllInBusiness,
	update,
	remove
}