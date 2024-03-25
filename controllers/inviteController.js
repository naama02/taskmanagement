const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const Project = require('../models/Project');
const { encodeInvitationToken, decodeInvitationToken } = require('../utils/util');
const Notification = require('../models/Notification');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const inviteUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.email == req.body.inviteEmail) {
        return res.status(400).send({ status: 'error', message: 'Provide correct Invitation Email' }) 
    }
    const project = await Project.findById(req.body.projectId);
    const projectName = project.name;
    const inviterName = user.firstName + ' ' + user.lastName;
    const invitedName = req.body.inviteEmail;
    const serverUrl = process.env.SERVER_URL;
    const expiresIn = '1d';
    const inviteToken = encodeInvitationToken(user._id, project._id, req.body.inviteEmail, expiresIn);
    const inviteLink = `${serverUrl}/invite?inviteToken=${inviteToken}`;

    const htmlContent = `
        <p>Hi ${invitedName},</p>
        <p>${inviterName} has invited you to collaborate on the <strong>${projectName}</strong> on Task Management.</p>
        <p>To accept the invitation, click the link below:</p>
        <a href="${inviteLink}" target="_blank">Accept Invitation</a>
        <p>Thank you!</p>
    `;

    const msg = {
        to: req.body.inviteEmail,
        from: process.env.SENDER_EMAIL,
        subject: `${inviterName} has invited you to collaborate on ${projectName}`,
        html: htmlContent,
    };

    try {
        await sgMail.send(msg);
        return res.status(202).send({ status: 'success', message: 'Invitation Email sent successfully' })
    } catch(error) {
        return res.status(500).send({ status: 'error', message: error.toString() })
    }

}

const inviteView = async (req, res) => {
    const inviteToken = req.query.inviteToken;
    const decodedToken = decodeInvitationToken(inviteToken);

    if (decodedToken && new Date(decodedToken.exp * 1000) > Date.now()) {
        // Token is valid and not expired
        const { userId, projectId, invitedEmail } = decodedToken;
        console.log(decodedToken)
        const userExists = await User.findOne({ email: invitedEmail });
        if (userExists) {
            const project = await Project.findById(projectId);
            // Check if the 'groups' field exists in the project
            if (project.groups) {
                // Check if the userId is already included in the 'groups' array
                if (!project.groups.includes(userExists._id)) {
                    // Append the userId to the 'groups' array
                    project.groups.push(userExists._id);
                }
            } else {
                // If the 'groups' field doesn't exist, create it and add the userId
                project.groups = [userExists._id];
            }
            await project.save();
            const notificationData = {
                type: 'Invitation',
                content: "You have received invitation",
                sender: userId,
                receiver: userExists._id
            }
            await Notification.create(notificationData);
            return res.redirect(`/dashboard`);
        } else {
            return res.redirect(`/register?inviteToken=${inviteToken}`);
        }
        // Proceed with the invitation process
        // res.render('invitation', { userId, projectId, invitedEmail });
    } else {
        return res.status(400).send('Invalid or expired invitation link');
    }
}

const inviteList = async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findById(projectId).populate({
            path: 'groups',
        })
    
        return res.send({ status: "success", projectGroups: project.groups })
    } catch (err) {
        return res.send({ status: "error", message: err.message })
    }
    
}

module.exports = {
    inviteUser,
    inviteView,
    inviteList,
}
