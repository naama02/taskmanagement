const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = {
    expireTime: '1d',
};

const loginView = (req, res) => {
    res.render('login', {
        status: ''
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOneAndUpdate({ email: email }, { lastLogin: new Date() }).select('-__v');
    if (!user) {
        return res.send({ status: "error", message: "Email provided is not a registered account" })
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        return res.send({ status: "error", message: "Email or password not found!" })
    }

    // validation passed, create tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });
    // remove password
    delete user._doc.password;
    const userData = user;
    const response = {
        userData,
        accessToken,
    };

    return res.status(200).send({
        status: 'success',
        response
    });
}

module.exports = {
    loginView,
    login
}