const Event = require("../models/Event");
const moment = require("moment");

const createEvent = async (req, res) => {   
    // check for unique event
    const eventExists = await Event.findOne({ title: req.body.title });
    if (eventExists) { 
        return res.send({ status: "error", message: "event already exists" }); 
    }

    const eventData = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        hour: req.body.hour,
        location: req.body.location,
        attachedFile: req.body.attachedFile,
        user: req.user._id,
        color: req.body.color,
    }

    try {
        await Event.create(eventData);
        
        return res.send({ status: "success", message: "Event successfully created" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const eventListView = async (req, res) => {   
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const events = await Event.find(searchFilter).populate({
        path: 'user',
        select: {
            _id: 1, firstName: 1, lastName: 1,
        },
    });
    return res.render('eventList', { 'status': '', curPath: req.path, events: events, moment: moment })
}

module.exports = {
    createEvent,
    eventListView,
}