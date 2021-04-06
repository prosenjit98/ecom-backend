const jwt = require('jsonwebtoken')
const User = require('../models/User')
const multer = require('multer');
const shortid = require('shortid')
//  const { addCatagory, getCategories } = require('../controllers/category');
const path = require('path')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

exports.upload = multer({ storage })


exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    const user = jwt.verify(token, process.env.SECREATE_KEY);
    console.log("into to signin authenication:=========================", user)
    req.user = user
  } else {
    return res.status(400).send({ message: "Authorisation Required" })
  }
  next();
}

exports.userMiddleware = (req, res, next) => {
  console.log("into the userMiddle ware---", req.body.user)
  User.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) return res.status(500).send({ message: "Something went wrong" })
    next()
  })
}

exports.adminMiddleware = (req, res, next) => {
  User.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) return res.status(500).send({ message: "Something went wrong" })
    if (user) {
      if (user.role !== 'admin') return res.status(400).send({ message: "access denied" })
      next()
    }
  })
}
