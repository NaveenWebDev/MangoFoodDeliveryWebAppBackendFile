const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const genToken = async (userId) => {
    try{
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return token;

    }catch(error){
        console.error("Error generating token:", error);
    }
}

module.exports = genToken;