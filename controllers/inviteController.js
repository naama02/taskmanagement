const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const { encodeInvitationToken, decodeInvitationToken } = require('../utils/util');
const Notification = require('../models/Notification');
const Calendar = require('../models/Calendar');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const inviteUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.email == req.body.inviteEmail) {
        return res.status(400).send({ status: 'error', message: 'Provide correct Invitation Email' }) 
    }
    const calendar = await Calendar.findById(req.body.calendarId);
    const calendarName = calendar.name;
    const inviterName = user.firstName + ' ' + user.lastName;
    const invitedName = req.body.inviteEmail;
    const serverUrl = process.env.SERVER_URL;
    const expiresIn = '1d';
    const inviteToken = encodeInvitationToken(user._id, calendar._id, req.body.inviteEmail, expiresIn);
    const inviteLink = `${serverUrl}/invite?inviteToken=${inviteToken}`;

    const htmlContent = `
        <p>Hi ${invitedName},</p>
        <p>${inviterName} has invited you to collaborate on the <strong>${calendarName}</strong> on Task Management.</p>
        <p>To accept the invitation, click the link below:</p>
        <a href="${inviteLink}" target="_blank">Accept Invitation</a>
        <p>Thank you!</p>
    `;

    const msg = {
        to: req.body.inviteEmail,
        from: process.env.SENDER_EMAIL,
        subject: `${inviterName} has invited you to collaborate on ${calendarName}`,
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
        const { userId, calendarId, invitedEmail } = decodedToken;
        console.log(decodedToken)
        const userExists = await User.findOne({ email: invitedEmail });
        if (userExists) {
            const calendar = await Calendar.findById(calendarId);
            // Check if the 'groups' field exists in the calendar
            if (calendar.groups) {
                // Check if the userId is already included in the 'groups' array
                if (!calendar.groups.includes(userExists._id)) {
                    // Append the userId to the 'groups' array
                    calendar.groups.push(userExists._id);
                }
            } else {
                // If the 'groups' field doesn't exist, create it and add the userId
                calendar.groups = [userExists._id];
            }
            await calendar.save();
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
        // res.render('invitation', { userId, calendarId, invitedEmail });
    } else {
        return res.status(400).send('Invalid or expired invitation link');
    }
}

const inviteList = async (req, res) => {
    const { calendarId } = req.body;
    try {
        const calendar = await Calendar.findById(calendarId).populate({
            path: 'groups',
        })
    
        return res.send({ status: "success", calendarGroups: calendar.groups })
    } catch (err) {
        return res.send({ status: "error", message: err.message })
    }
    
}

module.exports = {
    inviteUser,
    inviteView,
    inviteList,
}
