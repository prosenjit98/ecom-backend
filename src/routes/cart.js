const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addItemToCart, getCartItems, removeCartItem } = require('../controllers/cart');

const router = express.Router();

// router.get('/category/getcategories', getCategories)
router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart)
router.post('/user/getCartItems', requireSignin, userMiddleware, getCartItems)
router.post('/user/cart/removeItem', requireSignin, userMiddleware, removeCartItem)

module.exports = router