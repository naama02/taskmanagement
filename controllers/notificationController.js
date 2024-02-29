const Notification = require("../models/Notification")

const notificationList = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user._id }).populate({
            path: 'sender',
        }).populate({
            path: 'receiver',
        }).limit(5)
    
        return res.send({ status: "success", notifications: notifications })
    } catch (err) {
        return res.send({ status: "error", message: err.message })
    }
    
}

module.exports = {
    notificationList,
}