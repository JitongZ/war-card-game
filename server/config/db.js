require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const db = {};
module.exports = db;

initialize();
async function initialize() {
  // create db if it doesn't already exist
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`); // potentially avoid magic name like war

  // connect to db
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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




