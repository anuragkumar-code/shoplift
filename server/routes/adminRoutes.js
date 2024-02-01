const express = require('express');
const router = express.Router();

//import all middlewares here only
const adminMiddleware = require('../middleware/adminMiddleware');
const jwtMiddleware = require('../middleware/jwtMiddleware');


//import all controllers here only
const adminController = require('../controllers/adminController');




// all api's defined after this only
router.post('/dashboard', jwtMiddleware, adminMiddleware, adminController.getDashboard);


router.get('/test', async(req,res) => {
    res.send("hello from admin routes");
});

module.exports = router;
