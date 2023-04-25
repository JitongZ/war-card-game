const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { router } = require('../routes');

// Create an Express.js app
const app = express();

// Apply middleware to the app
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Register the routes
app.use(router);

// Process uncaughtException
process.on('uncaughtException', function (err) {
  console.log(err);
});

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('This is a War card game server!');
});

module.exports = app;
