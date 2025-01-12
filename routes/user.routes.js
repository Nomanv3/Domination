// routes/user.js
const express = require('express');
const router = express.Router();
const { Signup, Sign, logout , getprofile , getAllProducts , getProduct , createOrder , verifyPayment} = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth.isAuthenticated');




// Define routes
router.post('/Signup', Signup);
router.post('/Sign', Sign);
router.post('/Logout', logout);
router.get('/profile' , isAuthenticated , getprofile )


router.get('/products' , isAuthenticated , getAllProducts)
router.get('/product/:id' , isAuthenticated , getProduct)
router.get("/order/:id" , isAuthenticated , createOrder )
router.get("/verify/:id" , isAuthenticated , verifyPayment )


module.exports = router;
