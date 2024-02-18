const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (usergroupsAllowed) => async function auth(req, res, next) {
    const authCookie = req.headers.cookie;
    const list = {};
    
    if (!authCookie) {
        return res.redirect('/login');
    } else {
        authCookie.split(`;`).forEach(function (cookie) {
            let [name, ...rest] = cookie.split(`=`);
            name = name?.trim();
            if (!name) return;
            const value = rest.join(`=`).trim();
            if (!value) return;
            list[name] = decodeURIComponent(value);
        });

        if (list['accessToken']) {
            const token = list['accessToken'];
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
                return res.render('error', { status: 'error', message: 'Invalid or expired auth token' });
            }
        } else {
            return res.render('error', { status: 'error', message: 'Malformed or unauthenticated auth token' });
        }

    }
};
