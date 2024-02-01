const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Sequelize = require('sequelize');
const User = require('../models/userModel');
const secretKey = process.env.JWT_KEY;


//function to register new user
const registerUser = async (req,res) => {
    // console.log(req.body);
    const fetched = req.body;
    try {

        if (!fetched.firstname || !validator.isAlpha(fetched.firstname)) {
            throw new Error('Invalid or missing first name. It should only contain letters.');
        }

        if (!fetched.lastname || !validator.isAlpha(fetched.lastname)) {
            throw new Error('Invalid or missing last name. It should only contain letters.');
        }

        if (!fetched.mobile || !validator.isMobilePhone(fetched.mobile, 'any', { strictMode: false })) {
            throw new Error('Invalid or missing mobile number.');
        }

        if (!fetched.email || !validator.isEmail(fetched.email)) {
            throw new Error('Invalid or missing email address.');
        }

        if (!fetched.password) {
            throw new Error('Missing password.');
        }

        const emailUser = await User.findOne({ where: { email: fetched.email } });
        if (emailUser) {
            throw new Error('Email already exists.');
        }

        const mobileUser = await User.findOne({ where: { mobile: fetched.mobile } });
        if (mobileUser) {
            throw new Error('Mobile number already exists.');
        }

        const saltRounds = process.env.SALT_ROUNDS;
        const salt = bcrypt.genSaltSync(parseInt(saltRounds));
        const hashedPassword = await bcrypt.hash(fetched.password, salt);

        const newUser = { 
            firstname:fetched.firstname,
            lastname:fetched.lastname,
            mobile:fetched.mobile,
            password:hashedPassword, 
            password_decode:fetched.password, 
            email:fetched.email
        };

        const createdUser = await User.create(newUser);

        // console.log(insertUserQuery);
        console.log(createdUser);

        if (createdUser) {
            res.status(201).json({ message: 'User registered successfully', createdUser });
        } else {
            throw new Error('Failed to register user');
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
        
    }
}

//function to login users with password
const loginUser = async (req, res) => {
    const fetched = req.body;

    try {
        if (!fetched.email || !validator.isEmail(fetched.email)) {
            throw new Error('Invalid or missing email address.');
        }

        if (!fetched.password) {
            throw new Error('Missing password.');
        }

        const user = users.find(user => user.email === fetched.email);

        if (!user) {
            throw new Error('User not found.');
        }

        let isPasswordValid = false;

        isPasswordValid = await new Promise((resolve, reject) => {
            bcrypt.compare(fetched.password, user.passwordHash, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (!isPasswordValid) {
            throw new Error('Invalid password.');
        }
    
        const token = jwt.sign({ userId: user.id, email: user.email, role: 'A' }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: "All good.", token });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//function to user change password
const changePassword = async (req,res) => {             //untested function, need to test this api over postman
    const fetched = req.body;

    try {
        if (!fetched.email || !validator.isEmail(fetched.email)) {
            throw new Error('Invalid or missing email address.');
        }

        if (!fetched.password) {
            throw new Error('Please enter password.');
        }

        const user = users.find(user => user.email === fetched.email);

        if (!user) {
            throw new Error('User not found.');
        }

        let isPasswordValid = false;

        isPasswordValid = await new Promise((resolve, reject) => {
            bcrypt.compare(fetched.password, user.passwordHash, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (!isPasswordValid) {
            throw new Error('Incorrect old password.');
        }

        const saltRounds = process.env.SALT_ROUNDS;

        let newHashedPassword;

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(fetched.password, salt, function(err, hash) {
                newHashedPassword = hash;
            });
        });

        // Update the user's password in the users array
        user.passwordHash = newHashedPassword;

        res.status(201).json({ message: 'Password changed successfully.' });

    } catch (error) {
        res.status(400).json({ error: error.message });
        
    }
}

//function to send or generate otp for login via both email or mobile
const sendOtp = async (req,res) => {
    const fetched = req.body;
    
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        let user;

        if (emailRegex.test(fetched.mobileOrMail)) {
            user = users.find(user => user.email === fetched.mobileOrMail);
            
        } else if (mobileRegex.test(fetched.mobileOrMail)) {
            user = users.find(user => user.mobile === fetched.mobileOrMail);
        }

        if(!user){
            throw new Error('User not found.');
        }

        const generateOTP = Math.floor(100000 + Math.random() * 900000).toString();

        //here we need to store otp in db also that we will do later

        res.status(201).json({ message: 'OTP generated successfully.', userIdentifier: user.id, otp:generateOTP });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
        
    }
}

//function to login user via otp using mobile or email both
const loginWithOtp = async (req,res) => {
    const fetched = req.body;

    try {
        const enteredOtp = fetched.enteredOtp;
        const identifier = fetched.userIdentifier;

        if (!enteredOtp || !identifier) {
            throw new Error('Invalid input.');
        }

        console.log(enteredOtp);
        console.log(identifier);

        const user = users.find(user => user.id === identifier && user.otp === enteredOtp);

        if (!user) {
            throw new Error('Invalid OTP or identifier.');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'OTP validated successfully.', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//to export all functions to the router
module.exports = {
    registerUser,
    loginUser,
    changePassword,
    sendOtp,
    loginWithOtp
};