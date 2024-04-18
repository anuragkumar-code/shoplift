const redis = require('redis');
const User = require('../models/userModel');

const client = redis.createClient({
    host: 'localhost', 
    port: 6379,
});

// function to generate OTP and store it in Redis
const generateAndStoreOTP = (userId) => {
    const generateOTP = Math.floor(100000 + Math.random() * 900000).toString();

    client.set(`otp:${userId}`, generateOTP, 'EX', 300); 
    return generateOTP;
};

// function to retrieve OTP from Redis
const getOTPFromRedis = (userId) => {
    return new Promise((resolve, reject) => {
        client.get(`otp:${userId}`, (err, otp) => {
            if (err) {
                reject(err);
            } else {
                resolve(otp);
            }
        });
    });
};

const sendOtp = async (req, res) => {
    const fetched = req.body;
    
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        let user;

        if (emailRegex.test(fetched.mobileOrMail)) {
            user = await User.findOne({ where: { email: fetched.mobileOrMail } });
            
        } else if (mobileRegex.test(fetched.mobileOrMail)) {
            user = await User.findOne({ where: { mobile: fetched.mobileOrMail } });
        }

        if (!user) {
            throw new Error('User not found.');
        }

        const generatedOTP = generateAndStoreOTP(user.id);

        res.status(201).json({ message: 'OTP generated successfully.', userIdentifier: user.id, otp: generatedOTP });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const verifyOTP = async (userId, enteredOTP) => {
    try {
        const storedOTP = await getOTPFromRedis(userId);

        if (storedOTP === enteredOTP) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return false;
    }
};


module.exports = {
    sendOtp,
    verifyOTP
};