const Event = require("../models/Event");

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

module.exports = {
    createEvent
}