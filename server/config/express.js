const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const gameRoutes = require('../routes/game.routes');
// const playerRoutes = require('../routes/player.routes');

// Create an Express.js app
const app = express();

// Apply middleware to the app
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Register the routes
app.use(gameRoutes);
// app.use(playerRoutes);

module.exports = app;
