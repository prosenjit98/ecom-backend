const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware/index');
const { updateOrders } = require('../../controllers/admin/order.admin');


const router = express.Router();

router.post('/order/update', requireSignin, adminMiddleware, updateOrders)

module.exports = routers