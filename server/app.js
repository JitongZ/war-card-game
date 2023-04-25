require('dotenv').config();
const {expressApp, logger} = require('./config');

// Start the server
const PORT = process.env.NODE_DOCKER_PORT || 3001;

// Log a message
logger.info('Server started?');
logger.info(`NODE_DOCKER_PORT is ${process.env.NODE_DOCKER_PORT}`)

var server = expressApp.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

module.exports = { server };

