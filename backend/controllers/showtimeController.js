const Showtime = require('../models/Showtime')

//get all showtime
const getShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.find()
        res.json(showtime)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//get showtime of theater, theater
const getShowtimeOfTheater = async (req, res) => {
    try {
        const theaterId = req.params.theaterId
        //find list room of theater
        const room = await Room.find({ theaterId: theaterId })
        const showtime = await Showtime.find({ room: room._id })
        res.json(showtime)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//create showtime
const createShowtime = async (req, res) => {
    try {
        const showtime = new Showtime(req.body)
        await showtime.save()
        res.json(showtime)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


//update showtime
const updateShowtime = async (req, res) => {
    try {
        const showtimeId = req.params.showtimeId
        const showtime = await Showtime.findByIdAndUpdate(showtimeId, req.body, {
            new: true
        })
        res.json(showtime)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




module.exports = {
    getShowtime,
    getShowtimeOfTheater,
    createShowtime,
    updateShowtime,
}