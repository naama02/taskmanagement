const User = require("../models/User");
const bcrypt = require('bcrypt');
const moment = require("moment");
const { ObjectId } = require('mongodb');

const saltLength = 10;

const userListView = async (req, res) => {   
    const users = await User.find();
    return res.render('userList', { 'status': '', curPath: req.path, users: users, curUserRole: req.user.role })
}

const userCreateView = async (req, res) => {   
    return res.render('createUser', { 'status': '', curPath: req.path, curUserRole: req.user.role, curUserRole: req.user.role })
}

const createUser = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.send({ status: "error", message: "User already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: 'user',
    }

    try {
        await User.create(userData);

        return res.send({ status: "success", message: "User successfully created" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const userUpdateView = async (req, res) => {
    const user = await User.findById(req.params.userId);
    return res.render('editUser', {
        status: '',
        user: user,
        curPath: req.path,
        moment: moment
    });
}

const updateUser = async (req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    }

    try {
        await User.findOneAndUpdate({ _id: req.params.userId }, userData, { upsert: true, new: true });

        return res.send({ status: "success", message: "User successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const userDelete = async (req, res) => {
    const { userId } = req.body;
    try {
        await User.deleteOne({ _id: new ObjectId(userId) });
        return res.send({ status: "success", message: "User data deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
}


module.exports = {
    userListView,
    userCreateView,
    createUser,
    userDelete,
    updateUser,
    userUpdateView,
}