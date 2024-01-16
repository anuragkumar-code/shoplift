const express = require('express');
const router = express.Router();

const userController = require('../controllers/authController')


// POST register a new user
router.post('/register', async (req, res) => {
    const { firstname, lastname, mobile, email, password } = req.body;
    
    try {
        await userController.registerUser(firstname,lastname,mobile,email,password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

router.get('/test', async(req,res) => {
    res.send("hello from api");
});



module.exports = router;