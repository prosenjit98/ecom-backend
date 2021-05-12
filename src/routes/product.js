const express = require('express');
const { requireSignin, adminMiddleware, uploadToDrive } = require('../common-middleware');
const { createProduct, getProductsBySlug, getProductById, deleteProductById, getProducts } = require('../controllers/product');
const multer = require('multer');
const shortid = require('shortid')
//  const { addCatagory, getCategories } = require('../controllers/category');
const router = express.Router();
const path = require('path')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage })


// router.get('/product/getcategories', getCategories)
// router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), createProduct)
router.post('/product/create', requireSignin, adminMiddleware, uploadToDrive.array('productPicture'), createProduct)
router.get('/products/:slug', getProductsBySlug)
router.get('/product/:productId', getProductById)
router.post("/product/deleteProductById", requireSignin, adminMiddleware, deleteProductById)
router.post("/product/getProducts", requireSignin, adminMiddleware, getProducts)

module.exports = router