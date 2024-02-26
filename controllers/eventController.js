const Event = require("../models/Event");
const moment = require("moment");
const { ObjectId } = require('mongodb');

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
        category: req.body.category,
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

const eventCreateView = async (req, res) => {   
    return res.render('createEvent', { 'status': '', curPath: req.path })
}

const eventUpdateView = async (req, res) => {
    const event = await Event.findById(req.params.eventId);
    return res.render('editEvent', {
        status: '',
        event: event,
        curPath: req.path,
        moment: moment
    });
}

const updateEvent = async (req, res) => {
    let eventData;
    if (req.body.attachedFile) {
        eventData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            hour: req.body.hour,
            location: req.body.location,
            attachedFile: req.body.attachedFile,
            color: req.body.color,
        }
    } else {
        eventData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            hour: req.body.hour,
            location: req.body.location,
            color: req.body.color,
        }
    }

    try {
        await Event.findOneAndUpdate({ _id: req.params.eventId }, eventData, { upsert: true, new: true });

        return res.send({ status: "success", message: "Event successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const updateEventDate = async (req, res) => {
    let eventData = {
        date: req.body.date,
        hour: req.body.hour,
    }

    try {
        await Event.findOneAndUpdate({ _id: req.params.eventId }, eventData, { upsert: true, new: true });

        return res.send({ status: "success", message: "Event successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const eventDelete = async (req, res) => {
    const { eventId } = req.body;
    try {
        await Event.deleteOne({ _id: new ObjectId(eventId) });
        return res.send({ status: "success", message: "Event data deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
}

module.exports = {
    createEvent,
    eventListView,
    eventCreateView,
    eventUpdateView,
    updateEvent,
    eventDelete,
    updateEventDate,
}