const bcrypt = require('bcrypt');
const { registerValidation } = require("../utils/validation");
const User = require('../models/User');

const saltLength = 10;

const registerView = (req, res) => {
    res.render('register', {
        status: ''
    });
}

const register = async (req, res) => {
    let body = req.body;
    body.role = "user";
    
    // validate request
    const { error } = registerValidation(body);
    if (error) { 
        return res.send({ status: "error", message: error.details[0].message }); 
    }

    // check for unique user
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) { 
        return res.send({ status: "error", message: "Email already exists" }); 
    }
    
    // hash the password
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: req.body.role,
    }

    try {
        await User.create(userData);
        
        return res.send({ status: "success", message: "User successfully registered" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

module.exports = {
    registerView,
    register
}