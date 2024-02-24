const User = require("../models/User");

const userListView = async (req, res) => {   
    const users = await User.find();
    return res.render('userList', { 'status': '', curPath: req.path, users: users })
}

module.exports = {
    userListView,
}