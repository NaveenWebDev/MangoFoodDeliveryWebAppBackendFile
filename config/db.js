const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
    }catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

module.exports = connectDb;