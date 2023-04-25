const express = require('express');
const router = express.Router();
const { startGame, getLifetimeWins, clearDatabase} = require('../controllers');

// Endpoint for starting a new game
router.post('/start', startGame);

// Endpoint for getting lifetime wins
router.get('/lifetime-wins', getLifetimeWins);

// Endpoint to clear game data
router.delete('/clear', clearDatabase);

module.exports = router;

