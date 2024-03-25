const Event = require("../models/Event");
const moment = require("moment");
const { ObjectId } = require('mongodb');
const Calendar = require("../models/Calendar");
const Category = require("../models/Category");

const createEvent = async (req, res) => { 
    const checkExists = await Event.findOne({ date: req.body.date, hour: req.body.hour });
    if (checkExists) {
        return res.send({ status: "error", message: "Event already exists with same date and hour." });
    }  
    // check for unique event
    const eventExists = await Event.findOne({ title: req.body.title });
    if (eventExists) { 
        return res.send({ status: "error", message: "Event already exists" }); 
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
        calendar: req.body.calendar,
        type: req.body.type,
    }

    try {
        const event = await Event.create(eventData);
        const parsedTime = moment(event.hour, 'h:mm A');
        const hours = parsedTime.hours();
        const minutes = parsedTime.minutes();
        const eData = {
            id: event._id,
            title: event.title,
            start: moment(event.date).add({ hours: hours, minutes: minutes }).format('YYYY-MM-DDTHH:mm:ss'),
            backgroundColor: event.color,
            borderColor: event.color,
            location: event.location,
        }
        return res.send({ status: "success", message: "Event successfully created", tdata: eData })
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
    return res.render('eventList', { 'status': '', curPath: req.path, events: events, moment: moment, curUserRole: req.user.role })
}

const eventCreateView = async (req, res) => {
    let query = {
        $or: [
            { owner: req.user._id },
            { groups: { $in: [req.user._id] } }
        ]
    };

    if (req.user.role === 'admin') {
        query = {};
    }
    const calendars = await Calendar.find(query);
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const categories = await Category.find(searchFilter).populate({
        path: 'user',
        select: {
            _id: 1, firstName: 1, lastName: 1,
        },
    }).select('-__v');   
    return res.render('createEvent', { 'status': '', curPath: req.path, calendars: calendars, categories: categories, curUserRole: req.user.role })
}

const eventUpdateView = async (req, res) => {
    let query = {
        $or: [
            { owner: req.user._id },
            { groups: { $in: [req.user._id] } }
        ]
    };

    if (req.user.role === 'admin') {
        query = {}; // Fetch all calendars for admin
    }
    const calendars = await Calendar.find(query);
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const categories = await Category.find(searchFilter).populate({
        path: 'user',
        select: {
            _id: 1, firstName: 1, lastName: 1,
        },
    }).select('-__v');
    const event = await Event.findById(req.params.eventId);
    return res.render('editEvent', {
        status: '',
        event: event,
        curPath: req.path,
        moment: moment,
        calendars: calendars, 
        categories: categories,
        curUserRole: req.user.role
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
            type: req.body.type,
            category: req.body.category,
            calendar: req.body.calendar,
        }
    } else {
        eventData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            hour: req.body.hour,
            location: req.body.location,
            color: req.body.color,
            type: req.body.type,
            category: req.body.category,
            calendar: req.body.calendar,
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