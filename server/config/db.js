require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const logger = require('./logger');
const db = {};
module.exports = db;

initialize();
async function initialize() {
  try {
    // create db if it doesn't already exist
    logger.info(`Creating connection with db: ${process.env.DB_HOST}, ${process.env.DB_PORT}, ${process.env.DB_USER}, ${process.env.DB_PASSWORD}`);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      // host: '/var/run/mysqld/mysqlx.sock',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`); // potentially avoid magic name like war
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  // connect to db
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // host: '/var/run/mysqld/mysqlx.sock',
    dialect: 'mysql',
    logging: false
  });

  // init models and add them to the exported db object
  const { Game, Player } = require('../models/game.model')(sequelize, Sequelize);
  db.Game = Game;
  db.Player = Player;
  db.sequalize = sequelize;
  db.Sequalize = Sequelize;
  // sync all models with database
  await sequelize.sync();
}




