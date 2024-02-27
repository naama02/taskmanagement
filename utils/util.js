const jwt = require('jsonwebtoken');

const encodeInvitationToken = (userId, projectId, invitedEmail, expiresIn) => {
    const payload = { userId, projectId, invitedEmail, expiresIn };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const decodeInvitationToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = {
    encodeInvitationToken,
    decodeInvitationToken
}