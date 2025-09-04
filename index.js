const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Food Delivery API');
});

// Start server
app.listen(PORT, () => {
    connectDb();
    console.log(`Server running on port ${PORT}`);
});