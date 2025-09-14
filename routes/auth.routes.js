const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, sendOtp, verifyOtp, resetPassword  } = require('../controllers/auth.controllers');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);


module.exports = router;