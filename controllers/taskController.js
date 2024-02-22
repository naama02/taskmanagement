const Task = require("../models/Task");

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

module.exports = {
    createTask
}