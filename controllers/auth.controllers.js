const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const genToken = require("../utils/token");

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