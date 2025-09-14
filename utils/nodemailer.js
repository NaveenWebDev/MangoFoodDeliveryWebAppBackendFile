const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

// Wrap in an async IIFE so we can use await.
const sendEmail = async (to, otp) => {
    try{

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: "Reset your password",
            // text: `Your OTP is: ${otp}`,
            html: `<b>Your OTP is: ${otp}. It expires in 5 minutes.</b>`,
        });
        
        console.log("Message sent:", info.messageId);
    } catch (error) {
        console.error("Error email not sent :", error.message);
    }
};
module.exports = sendEmail;