const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const genToken = require("../utils/token");
const sendEmail = require("../utils/nodemailer");

exports.signUp = async (req, res) =>{
    try{
        const {fullName, email, password, mobileNumber, role} = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (!fullName || !email || !mobileNumber || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (mobileNumber.length < 10) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            mobileNumber,
            role
        });

        // generate token
        const token = await genToken(newUser._id);

        res.cookie("token", token, { 
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
         });

        return res.status(201).json({ message: "User created successfully", newUser });


    } catch(error){
        console.error("Error signing up user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.signIn = async (req, res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // generate token
        const token = await genToken(user._id);
            res.cookie("token", token, { 
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
         });

        return res.status(200).json({ message: "User signed in successfully", user });


    } catch(error){
        console.error("Error signing in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.signOut = async (req, res) =>{
    try{
        res.clearCookie("token", {
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // secure: false,
            // sameSite: 'Strict',
        });
        return res.status(200).json({ message: "User signed out successfully" });
    } catch(error){
        console.error("Error signing out user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.sendOtp = async (req, res) =>{
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp;
        await user.save();

        user.resetOtp = otp;
        user.otpExpiryTime = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();

        // Send OTP email
        await sendEmail(email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.verifyOtp = async (req, res) =>{
    try{
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!user || user.resetOtp !== otp || user.otpExpiryTime < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.resetOtp = undefined;
        user.isOtpVerified = true;
        user.otpExpiryTime = undefined;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.resetPassword = async (req, res) =>{
    try{
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!user.isOtpVerified) {
            return res.status(400).json({ message: "OTP not verified" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}