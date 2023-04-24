require('dotenv').config();
const app = require('./config/express');
// const logger = require('./config/logger');
const db = require('./config/db');

// Start the server
const PORT = process.env.PORT || 3000;

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, world!');
});


console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });


