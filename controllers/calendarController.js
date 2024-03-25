const Calendar = require("../models/Calendar");
const Category = require("../models/Category");
const { ObjectId } = require('mongodb');

const createCalendar = async (req, res) => {
    // check for unique calendar
    const calendarExists = await Calendar.findOne({ name: req.body.name });
    if (calendarExists) {
        return res.send({ status: "error", message: "Calendar already exists" });
    }

    const calendarData = {
        name: req.body.name,
        owner: req.user._id,
    }

    try {
        const calendar = await Calendar.create(calendarData);
        const tprooject = await calendar.populate('owner');
        return res.send({ status: "success", message: "Calendar successfully created", data: tprooject })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const calendarView = async (req, res) => {
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const categories = await Category.find(searchFilter).populate({
        path: 'user',
        select: {
            _id: 1, firstName: 1, lastName: 1,
        },
    }).select('-__v');

    const calendar = await Calendar.findOne({ _id: req.params.calendarId })
    return res.render('calendar', { 'status': '', curPath: req.path, categories: categories, calendar: calendar, currentUser: req.user._id, curUserRole: req.user.role })
}

const calendarDelete = async (req, res) => {
    const { calendarId } = req.body;
    try {
        await Calendar.deleteOne({ _id: new ObjectId(calendarId) });
        return res.send({ status: "success", message: "Calendar deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
}

const calendarList = async (req, res) => {
    try {
        let calendars = [];
        let query = {
            $or: [
                { owner: req.user._id },
                { groups: { $in: [req.user._id] } }
            ]
        };

        if (req.user.role === 'admin') {
            query = {}; // Fetch all calendars for admin
        }

        calendars = await Calendar.find(query)
            .populate({
                path: 'owner',
                select: {
                    _id: 1, firstName: 1, lastName: 1,
                },
            })
            .populate('groups', 'name')
            .select('-__v');

        calendars = calendars.map(calendar => ({
            _id: calendar._id,
            name: calendar.name,
            ownerFirstname: calendar.owner.firstName,
            ownerPhoto: calendar.owner.ownerPhoto,
            groups: calendar.groups,
            master: calendar.owner._id.equals(req.user._id) ? 'owner' : 'group'
        }));

        return res.send({ status: "success", calendars: calendars });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: "error", message: err.message });
    }
};


module.exports = {
    createCalendar,
    calendarDelete,
    calendarList,
    calendarView,
}
