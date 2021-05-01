const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { getOrders, addOrder } = require('../controllers/order');
const router = express.Router();


router.get('/user/orders', requireSignin, userMiddleware, getOrders);
router.post('/user/create_order', requireSignin, userMiddleware, addOrder);

module.exports = router
