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

// increase parse limit
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
const loginRoute = require('./routes/login');
// const apiLoginRoute = require('./routes/api/login');
const registerRoute = require('./routes/register');
const registerAPIRoute = require('./routes/api/register');

app.use('', loginRoute);
app.use('/api', registerAPIRoute);
app.use('', registerRoute);


app.listen(PORT, () => console.log(`🛺  Task Server UP and Running at ${process.env.SERVER_URL}`));