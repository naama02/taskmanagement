const Task = require("../models/Task")
const Event = require("../models/Event")

const dashboard = async (req, res) => {
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const tasks = await Task.find(searchFilter).select('-__v');
    const events = await Event.find(searchFilter).select('-__v');
    console.log(req.path)
    return res.render('dashboard', {
        status: '',
        curPath: req.path,
        tasks: tasks,
        events: events
    })
    
}

module.exports = {
    dashboard
}
