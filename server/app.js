require('dotenv').config();
const {expressApp, logger} = require('./config');

// Start the server
const PORT = process.env.PORT || 3001;

// Log a message
logger.info('Server started');

var server = expressApp.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

module.exports = { server };

