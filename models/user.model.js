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
    },
    resetOtp:{
        type: String,
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    },
    otpExpiryTime:{
        type: Date,
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);