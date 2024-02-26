const Task = require("../models/Task")
const Event = require("../models/Event");
const Category = require("../models/Category");
const moment = require("moment");

const dashboard = async (req, res) => {
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const categories = await Category.find(searchFilter).select('-__v');

    return res.render('dashboard', {
        status: '',
        curPath: req.path,
        categories: categories
    })
    
}

const dashboardSchedule = async (req, res) => {
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const tasks = await Task.find(searchFilter).select('-__v');
    const events = await Event.find(searchFilter).select('-__v');
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
