const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (usergroupsAllowed) => async function auth(req, res, next) {
    const authCookie = req.headers.cookie;

    if (!authCookie) {
        return res.redirect('/login');
    } else {
        const cookies = authCookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        const token = cookies.token;

        if (token) {
            try {
                const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
                req.user = verified;

                let user;
                user = await User.findOne({ _id: req.user._id }).select('role');
                req.user.role = user.role;
                if ((usergroupsAllowed) && (!usergroupsAllowed.includes(user.role))) {
                    return res.render('error', { status: 'error', message: 'You do not have permission to run this request' });
                }
                next();
            } catch (err) {
                return res.redirect('/login');
            }
        } else {
            return res.render('error', { status: 'error', message: 'Malformed or unauthenticated auth token' });
        }

    }
};
