const db = require('../config/db');
const Chance = require('chance');
const chance = new Chance();

// const CARD_VALUES = [
//     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
//     20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
//     38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
//   ];

const startGame = async (req, res) => {
  try {
    const playerCount = await db.Player.count();

    if (playerCount !== 2) {
        throw new Error('Internal: There must be exactly two players in the players table.');
    }

    const players = await db.Player.findAll({});

    // Initialize decks and shuffle the cards
    let deck = [...Array(52).keys()];
    deck = chance.shuffle(deck);
    const deck1 = deck.splice(0, 27);
    const deck2 = deck;

    // Create a new game record in the database
    const game = await db.Game.create({
        // date: new Date(),
        // deck1: [...deck1],
        // deck2: [...deck2],
    });

    // Initialize the round
    let round = 1;
    let response = { draw: false, winner_name: "", loser_name: "", deck1: [...deck1], deck2: [...deck2], rounds: [] };

    // Play the game
    while (deck1.length > 0 && deck2.length > 0) {
        // Draw a card from each player's deck
        // note that the first card in the array is the top card facing downwards
        const card1 = deck1.shift();
        const card2 = deck2.shift();
  
        // Determine the winner of the round if no war
        let winner = null;
        if (card1 !== card2) {
            if (card1 > card2) {
                winner = players[0];
                deck1.push(card1, card2);
            } else if (card2 > card1) {
                winner = players[1];
                deck2.push(card2, card1);
            }
            response.rounds.push({
                round: round,
                cards1: [card1],
                cards2: [card2],
                winner: winner.name,
            })
            round++;
            continue;
        }
        
        // War! Initialize the current cards at arrays
        const cards1 = [card1];
        const cards2 = [card2];

        // add new information to the rounds
        response.rounds.push({
            round: round,
            cards1: [...cards1],
            cards2: [...cards2],
            winner: "draw",
        })
        round++;

        // Draw two more cards from each player's deck
        // when both players have enough cards on deck
        let draw = true;
        while (deck1.length >= 2 && deck2.length >= 2) {
            // new cards facing down
            cards1.push(deck1.shift());
            cards2.push(deck2.shift());

            // new cards facing up
            card1 = deck1.shift();
            cards1.push(card1);
            card2 = deck2.shift();
            cards2.push(card2);
            
            // find the winner
            if (card1 !== card2) {
                draw = false;
                if (card1 > card2) {
                    winner = players[0];
                    deck1.push(...cards1.reverse(), ...cards2.reverse());
                } else if (card2 > card1) {
                    winner = players[1];
                    deck2.push(...cards2.reverse(), ...cards1.reverse());
                }
                response.rounds.push({
                    round: round,
                    cards1: [...cards1],
                    cards2: [...cards2],
                    winner: winner.name,
                })
                round++;
                cards1 = []
                cards2 = []
                break;
            }
            // still a draw
            response.rounds.push({
                round: round,
                cards1: [...cards1],
                cards2: [...cards2],
                winner: "draw",
            })
            round++;
            continue;
        }
        // Found winner or either one run out of card
        if (draw) {
            // The one who runs out of card loses
            break;
        } else {
            // Found winner
            continue;
        }

    }

    // Update the game record with the winner and loser ids
    const winner = deck1.length >= deck2.length ? players[0] : players[1];
    const loser = deck1.length < deck2.length ? players[0] : players[1];

    // We exit the main loop, check if there is a final draw
    if (deck1.length === deck2.length) {
        // if both player have the same number of cards remaining 
        // either during a war or after winning/losing a round
        // either they have zero card, or they have one last card facing down
        // we call it a final draw
        response.draw = true;
        await game.update({
            draw: true,
            winner_id: winner.id,
            loser_id: loser.id,
        });
        
    } else {
        // One player runs out of card
        response.winner_name = winner.name;
        response.loser_name = loser.name;
        await game.update({
            winner_id: winner.id,
            loser_id: loser.id,
        });
    }

    // Update the player records with the game results
    await winner.increment('wins');

    // Send the response
    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLifetimeWins = async (req, res) => {
  try {
    // Get both players from the database
    const players = await db.Player.findAll();

    // Respond with an array of player objects with name and wins
    res.json(players.map(player => ({
      name: player.name,
      wins: player.wins
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const clearDatabase = async (req, res) => {
    try {
        // Delete all game records
        await db.Game.destroy({ where: {} });

        // Reset all player wins to 0
        await db.Player.destroy({ where: {} });
        const players = [
            { name: 'Player 1', wins: 0 },
            { name: 'Player 2', wins: 0 }
        ];
        for (const player of players) {
            const existingPlayer = await db.Player.findOne({ where: { name: player.name } });
            if (!existingPlayer) {
                await db.Player.create(player);
            }
        }

        res.json({ message: 'Database cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = { startGame, getLifetimeWins, clearDatabase};
