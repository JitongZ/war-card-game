const logger = require('../config/logger');

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
      await sequelize.sync();
      for (const player of players) {
        const existingPlayer = await Player.findOne({ where: { name: player.name } });
        if (!existingPlayer) {
          await Player.create(player);
        }
      }
      logger.info('Players initialized successfully');
    } catch (error) {
      logger.error(`Error initializing players: ${error.message}`);
    }
  }

  // Call the async function to initialize players
  initializePlayers();

  const Game = sequelize.define('game', {
    winner_id: Sequelize.INTEGER,
    loser_id: Sequelize.INTEGER,
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    draw: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    deck1: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      get() {
        return this.getDataValue('deck1').split(';').map(val => Number(val));
      },
      set(val) {
        if (Array.isArray(val)) {
          this.setDataValue('deck1', val.join(';'));
        } else {
          throw new Error('deck1 input is not an array');
        }
      },
    },
    deck2: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      get() {
        return this.getDataValue('deck2').split(';').map(val => Number(val));
      },
      set(val) {
        if (Array.isArray(val)) {
          this.setDataValue('deck2', val.join(';'));
        } else {
          throw new Error('deck2 input is not an array');
        }
      },
            
    },
  });
    
  Game.belongsTo(Player, { foreignKey: 'winner_id', as: 'winner' });
  Game.belongsTo(Player, { foreignKey: 'loser_id', as: 'loser' });
    
  // Sync the database and create the Game table if it doesn't exist
  sequelize.sync()
    .then(() => logger.info('Game table created'))
    .catch(error => {logger.error(`Error creating game table: ${error.message}`);
      console.error(error);});
  // .catch(error => {logger.error(`Error creating game table: ${error.message}`);
  //                  logger.error(error.stack);});
  return {Game, Player};
};



