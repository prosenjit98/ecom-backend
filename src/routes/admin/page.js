const express = require("express");
// const { upload } = require("../../common-middleware");
const { createPage, getPage } = require("../../controllers/admin/page");
const router = express.Router()
const multer = require('multer');
const shortid = require('shortid')
//  const { addCatagory, getCategories } = require('../controllers/category');
const path = require('path');
const { requireSignin, adminMiddleware } = require("../../common-middleware");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(path.dirname(__dirname)), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage })


router.post('/page/create', requireSignin, adminMiddleware, upload.fields([{ name: 'banners' }, { name: 'products' }]), createPage);
router.get('/page/:category/:type', getPage);

module.exports = router