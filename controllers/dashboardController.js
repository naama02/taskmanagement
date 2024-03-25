const Task = require("../models/Task")
const Event = require("../models/Event");
const moment = require("moment");
const { ObjectId } = require('mongodb');
const Calendar = require("../models/Calendar");

const dashboard = async (req, res) => {
    return res.render('dashboard', {
        status: '',
        curPath: req.path,
        curUserRole: req.user.role
    })
    
}

const dashboardSchedule = async (req, res) => {
    const { calendar }= req.body;
    let calendarFilter = {};
    const calendarData = await Calendar.findById(calendar);
    if (calendarData.owner == req.user._id) {
        calendarFilter = { calendar: calendar };
    } else {
        calendarFilter = { calendar: calendar, type: 'group' };
    }

    const tasks = await Task.find(calendarFilter).populate('calendar').select('-__v');
    const events = await Event.find(calendarFilter).populate('calendar').select('-__v');
    let scheduleEvents = [];

    for (var task of tasks) {
        const parsedTime = moment(task.hour, 'h:mm A');
        const hours = parsedTime.hours();
        const minutes = parsedTime.minutes();
        scheduleEvents.push({
            id: task._id,
            title: task.title,
            start: moment(task.date).add({ hours: hours, minutes: minutes }).format('YYYY-MM-DDTHH:mm:ss'),
            backgroundColor: task.color,
            borderColor: task.color,
            deadline: task.deadline,
        })
    }

    for (var event of events) {
        const parsedTime = moment(event.hour, 'h:mm A');
        const hours = parsedTime.hours();
        const minutes = parsedTime.minutes();
        scheduleEvents.push({
            id: event._id,
            title: event.title,
            start: moment(event.date).add({ hours: hours, minutes: minutes }).format('YYYY-MM-DDTHH:mm:ss'),
            backgroundColor: event.color,
            borderColor: event.color,
            location: event.location,
        })
    }

    return res.send({
        scheduleEvents: scheduleEvents,
    })
    
}

module.exports = {
    dashboard,
    dashboardSchedule
}
