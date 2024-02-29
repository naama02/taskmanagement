const bcrypt = require('bcrypt');
const { registerValidation } = require("../utils/validation");
const User = require('../models/User');
const { decodeInvitationToken } = require('../utils/util');
const Project = require('../models/Project');

const saltLength = 10;

const registerView = (req, res) => {
    const inviteToken = req.query.inviteToken;
    if (inviteToken) {
        const decodedToken = decodeInvitationToken(inviteToken);
        const { userId, projectId, invitedEmail } = decodedToken;
        res.render('register', {
            status: '',
            projectId: projectId,
            invitedEmail: invitedEmail
        });
    } else {
        res.render('register', {
            status: '',
            projectId: '',
            invitedEmail: ''
        });
    }
    
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
        const user = await User.create(userData);

        if (req.body.projectId) {
            const project = await Project.findById(req.body.projectId);
            // Check if the 'groups' field exists in the project
            if (project.groups) {
                // Check if the userId is already included in the 'groups' array
                if (!project.groups.includes(user._id)) {
                    // Append the userId to the 'groups' array
                    project.groups.push(user._id);
                }
            } else {
                // If the 'groups' field doesn't exist, create it and add the userId
                project.groups = [user._id];
            }
            await project.save();
            const notificationData = {
                type: 'Invitation',
                content: "You have received invitation",
                sender: project.owner,
                receiver: user._id
            }
            await Notification.create(notificationData);
        }
        
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