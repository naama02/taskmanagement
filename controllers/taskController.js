const Task = require("../models/Task");
const moment = require("moment");

const createTask = async (req, res) => {   
    // check for unique task
    const taskExists = await Task.findOne({ title: req.body.title });
    if (taskExists) { 
        return res.send({ status: "error", message: "Task already exists" }); 
    }

    const taskData = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        hour: req.body.hour,
        deadline: req.body.deadline,
        attachedFile: req.body.attachedFile,
        user: req.user._id,
        color: req.body.color,
    }

    try {
        await Task.create(taskData);
        
        return res.send({ status: "success", message: "Task successfully created" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const taskListView = async (req, res) => {   
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const tasks = await Task.find(searchFilter).populate({
        path: 'user',
        select: {
        _id: 1, firstName: 1, lastName: 1,
        },
    });
    return res.render('taskList', { 'status': '', curPath: req.path, tasks: tasks, moment: moment })
}

const taskList = async (req, res) => {   
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}

    try {
        const tasks = await Task.find(searchFilter);
        
        return res.send({ tasks: tasks })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: "error", message: err.message })
    }
}

module.exports = {
    taskList,
    createTask,
    taskListView,
}