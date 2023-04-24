const express = require('express');
const router = express.Router();
const { startGame, getLifetimeWins, clearDatabase} = require('../controllers/game.controller');

router.post('/start', startGame);
router.get('/lifetime-wins', getLifetimeWins);

// Endpoint to clear game data
router.delete('/clear', clearDatabase);

module.exports = router;

