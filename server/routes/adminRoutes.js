const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');



router.post('/dashboard', adminMiddleware, adminController.getDashboard);


router.get('/test', async(req,res) => {
    res.send("hello from admin routes");
});

module.exports = router;
