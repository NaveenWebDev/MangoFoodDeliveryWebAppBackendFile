const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const connectDb = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');

// Load environment variables from .env file
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    credentials: true, // for cookies
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(cookieParser()); // To parse cookies

// Import routes
app.use('/api-v1/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Food Delivery API');
});

// Start server
app.listen(PORT, () => {
    connectDb();
    console.log(`Server running on port ${PORT}`);
});