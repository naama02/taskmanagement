const express = require('express');
const dotenv = require("dotenv");
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

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
const projectRoute = require('./routes/project');

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
app.use('', projectRoute);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('error', { message: "404" });
});


app.listen(PORT, () => console.log(`🛺  Task Server UP and Running at ${process.env.SERVER_URL}`));