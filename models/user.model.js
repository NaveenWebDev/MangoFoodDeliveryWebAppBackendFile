const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
    },
    mobileNumber:{
        type: String,
        required:true,
    },
    role:{
        type: String,
        enum: ['user', 'owner', 'devliveryBoy'],
        default: 'user',
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);