const express = require('express');
const dotenv = require("dotenv");
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const creds = require("./client_secret.json");
const { google } = require('googleapis');
const moment = require('moment');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3009;

// Connect to DB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // Connection successful
        console.log('👓 Connected to DB')
    })
    .catch((error) => {
        // Handle connection error
        console.log('Connection Error => : ', error.message)
    });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        expires: new Date(Date.now() + 86400000),
    }
}));

app.use(cookieParser());

app.get('/', function (req, res) {
    res.redirect('/login');
});

// Routes
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const logoutRoute = require('./routes/logout');
const dashboardRoute = require('./routes/dashboard');
const fileRoute = require('./routes/file');
const avatarRoute = require('./routes/avatar');
const taskRoute = require('./routes/task');
const eventRoute = require('./routes/event');
const userRoute = require('./routes/users');
const categoryRoute = require('./routes/category');
const profileRoute = require('./routes/profile');
const calendarRoute = require('./routes/calendar');
const inviteRoute = require('./routes/invite');
const notificationRoute = require('./routes/notification');

app.use('', loginRoute);
app.use('', registerRoute);
app.use('', logoutRoute);
app.use('', dashboardRoute);
app.use('', taskRoute);
app.use('', eventRoute);
app.use('', fileRoute);
app.use('', avatarRoute);
app.use('', userRoute);
app.use('', categoryRoute);
app.use('', profileRoute);
app.use('', calendarRoute);
app.use('', inviteRoute);
app.use('', notificationRoute);

const { client_secret, client_id, redirect_uris } = creds.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const scopes = ['https://www.googleapis.com/auth/calendar'];
let redirectURL;

app.get("/google/redirect", async (req, res) => {
    if (req.query.redirectURL) {
        redirectURL = req.query.redirectURL;
    }
    if (req.query.code) {
        const code = req.query.code;
        try {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);
            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
            const startDate = moment().startOf('month').format('YYYY-MM-DD');
            const endDate = moment().endOf('month').format('YYYY-MM-DD');
            const response = await calendar.events.list({
                calendarId: 'primary',
                timeMin: startDate + 'T00:00:00Z',
                timeMax: endDate + 'T23:59:59Z',
                maxResults: 20,
                singleEvents: true,
                orderBy: 'startTime',
            });
            const events = response.data.items;
            if (events.length) {
                req.session.events = events;
            } else {
                req.session.events = [];
            }
            res.redirect(redirectURL);
        } catch (err) {
            console.error("Error retrieving or inserting events: ", err);
            res.status(500).send(err.message);
        }
    } else {
        const url = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            prompt: 'consent' // this may be necessary to ensure refresh token is received
        });
        console.log(url);
        res.redirect(url);
    }
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('error', { message: "404" });
});

app.listen(PORT, () => console.log(`🛺  Task Server UP and Running at ${process.env.SERVER_URL}`));