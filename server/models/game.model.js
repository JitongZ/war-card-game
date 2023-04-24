module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define('player', {
        name: { type: Sequelize.STRING, allowNull: false},
        wins: Sequelize.INTEGER
    });


    // Initialize two players
    const players = [
        { name: 'Player 1', wins: 0 },
        { name: 'Player 2', wins: 0 }
    ];

    // Define an async function to initialize players
    async function initializePlayers() {
        try {
            // await sequelize.sync();
            // await Player.bulkCreate(players);
            await sequelize.sync();
            for (const player of players) {
                const existingPlayer = await Player.findOne({ where: { name: player.name } });
                if (!existingPlayer) {
                    await Player.create(player);
                }
            }
            console.log('Players initialized successfully');
        } catch (error) {
            console.error('Error initializing players:', error);
        }
    }

    // Call the async function to initialize players
    initializePlayers();

    const Game = sequelize.define('game', {
        winner_id: Sequelize.INTEGER,
        loser_id: Sequelize.INTEGER,
        // date: {
        //     type: Sequelize.DATE,
        //     allowNull: false,
        //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        // },
        draw: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        // deck1: {
        //     type: Sequelize.ARRAY(Sequelize.INTEGER),
        //     defaultValue: []
        // },
        // deck2: {
        //     type: Sequelize.ARRAY(Sequelize.INTEGER),
        //     defaultValue: []
        // },
    });

    // const Game = sequelize.define('game', {
    //     date: {
    //         type: Sequelize.DATE,
    //         allowNull: false,
    //         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //     },
    //     draw: {
    //         type: Sequelize.BOOLEAN,
    //         defaultValue: false
    //     },
    //     winner_id: {
    //         type: Sequelize.INTEGER,
    //         allowNull: true
    //     },
    //     loser_id: {
    //         type: Sequelize.INTEGER,
    //         allowNull: true
    //     },
    //     deck1: {
    //         type: Sequelize.ARRAY(Sequelize.INTEGER),
    //         defaultValue: []
    //     },
    //     deck2: {
    //         type: Sequelize.ARRAY(Sequelize.INTEGER),
    //         defaultValue: []
    //     },
    // });
      
    
    Game.belongsTo(Player, { foreignKey: 'winner_id', as: 'winner' });
    Game.belongsTo(Player, { foreignKey: 'loser_id', as: 'loser' });
    
    // Sync the database and create the Game table if it doesn't exist
    sequelize.sync()
    .then(() => console.log('Game table created'))
    .catch(error => console.error('Error creating game table:', error));
    return {Game, Player};
};



