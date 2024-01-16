const express = require('express');
const router = express.Router();

// import all controllers below this only
const userController = require('../controllers/authController')


// write api's below this only
router.post('/register', userController.registerUser);                              //api for register user
router.post('/login', userController.loginUser);                                    //api for login user via jwt token
router.post('/change-password', userController.changePassword);                     //api for changing user password
router.post('/send-otp', userController.sendOtp);                                   //api for login via otp
router.post('/login-with-otp', userController.loginWithOtp);                        //api for login via otp


router.get('/test', async(req,res) => {
    res.send("hello from router");
});



module.exports = router;