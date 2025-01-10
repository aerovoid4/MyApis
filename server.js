
__path = process.cwd();
require('./settings');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const secure = require('ssl-express-www');
const path = require('path');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const ip = require('ip');
const useragent = require('useragent');
const { format } = require('date-fns');
const apirouter = require('./routes/api');
const PORT = 3000 || 5000 || 8000 || 8080;

const app = express();
app.enable('trust proxy');
app.set('json spaces', 2);
app.use(cors());
app.use(secure);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api', apirouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'docs.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.use((req, res, next) => {
    res.status(404).json({ 
        status: 404,
        creator: ownerName,
        message: "Hmph, looks like you're lost. The resource you're looking for doesn't exist, so stop wasting your time and check the URL again, okay?!"
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
