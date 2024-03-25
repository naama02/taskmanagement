const User = require("../models/User");

const profileView = async (req, res) => {
    const profile = await User.findOne({ _id: req.user._id }).select('-__v');

    return res.render('profile', {
        status: '',
        curPath: req.path,
        profile: profile,
    })
    
}

const updateProfile = async (req, res) => {
    let userData;
    if (req.body.photo) {
        userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            photo: req.body.photo,
        }
    } else {
        userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        }
    }

    try {
        await User.findOneAndUpdate({ _id: req.params.userId }, userData, { upsert: true, new: true });

        return res.send({ status: "success", message: "Profile successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

module.exports = {
    profileView,
    updateProfile
}
