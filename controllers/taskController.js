const Task = require("../models/Task");
const moment = require("moment");
const { ObjectId } = require('mongodb');
const Calendar = require("../models/Calendar");
const Category = require("../models/Category");

const createTask = async (req, res) => {
    const checkExists = await Task.findOne({ date: req.body.date, hour: req.body.hour });
    if (checkExists) {
        return res.send({ status: "error", message: "Task already exists with same date and hour." });
    }
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
        attachedFile: req.body.attachedFile,
        user: req.user._id,
        color: req.body.color,
        category: req.body.category,
        calendar: req.body.calendar,
        type: req.body.type,
    }

    try {
        const task = await Task.create(taskData);
        const parsedTime = moment(task.hour, 'h:mm A');
        const hours = parsedTime.hours();
        const minutes = parsedTime.minutes();
        const tData = {
            id: task._id,
            title: task.title,
            start: moment(task.date).add({ hours: hours, minutes: minutes }).format('YYYY-MM-DDTHH:mm:ss'),
            backgroundColor: task.color,
            borderColor: task.color,
        }

        return res.send({ status: "success", message: "Task successfully created", tdata: tData });
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
    return res.render('taskList', { 'status': '', curPath: req.path, tasks: tasks, moment: moment, curUserRole: req.user.role })
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

const taskCreateView = async (req, res) => {
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
    return res.render('createTask', { 'status': '', curPath: req.path, calendars: calendars, categories: categories, curUserRole: req.user.role })
}

const taskUpdateView = async (req, res) => {
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
    const task = await Task.findById(req.params.taskId);

    return res.render('editTask', {
        status: '',
        task: task,
        curPath: req.path,
        moment: moment,
        calendars: calendars, 
        categories: categories,
        curUserRole: req.user.role
    });
}

const updateTask = async (req, res) => {
    let taskData;
    if (req.body.attachedFile) {
        taskData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            hour: req.body.hour,
            attachedFile: req.body.attachedFile,
            color: req.body.color,
            type: req.body.type,
            category: req.body.category,
            calendar: req.body.calendar,
        }
    } else {
        taskData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            hour: req.body.hour,
            color: req.body.color,
            type: req.body.type,
            category: req.body.category,
            calendar: req.body.calendar,
        }
    }

    try {
        await Task.findOneAndUpdate({ _id: req.params.taskId }, taskData, { upsert: true, new: true });

        return res.send({ status: "success", message: "Task successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}


const updateTaskDate = async (req, res) => {
    let taskData = {
        date: req.body.date,
        hour: req.body.hour,
    }
    try {
        await Task.findOneAndUpdate({ _id: req.params.taskId }, taskData, { upsert: true, new: true });
        return res.send({ status: "success", message: "Task successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const taskDelete = async (req, res) => {
    const { taskId } = req.body;
    try {
        await Task.deleteOne({ _id: new ObjectId(taskId) });
        return res.send({ status: "success", message: "Task data deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
}

module.exports = {
    taskList,
    createTask,
    taskListView,
    taskCreateView,
    taskUpdateView,
    updateTask,
    taskDelete,
    updateTaskDate,
}