const jwt = require('jsonwebtoken')
const User = require('../models/User')
const multer = require('multer');
const shortid = require('shortid')
const { google } = require('googleapis')
const GoogleDriveStorage = require('multer-google-drive')
//  const { addCatagory, getCategories } = require('../controllers/category');
const path = require('path')


/****google drive initialisation start*****/

const oauth2Clint = new google.auth.OAuth2(
  process.env.CLINT_ID, process.env.CLINT_SECREATE, process.env.REDIRECT_URI
);

oauth2Clint.setCredentials({ refresh_token: process.env.REFREAH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Clint
});

/****google drive initialisation end*****/

/******Local disc multer start here ******/

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

exports.upload = multer({ storage });

/******Local disc multer ends here ******/
/******drive multer start here ******/

exports.uploadToDrive = multer({
  storage: GoogleDriveStorage({
    drive: drive,
    parents: process.env.driveFolderParentId,
    fileName: function (req, file, cb) {
      let filename = `${shortid.generate()} + '-' + ${file.originalname}`;
      cb(null, filename);
    }
  })
})

/******drive multer end here ******/

exports.createPublicAccess = async (fileId) => {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })
  } catch (err) {
    console.log(err)
  }
}


exports.requireSignin = async (req, res, next) => {
  if (req.headers.authorization) {
    console.log("authenication start:========================")
    const token = req.headers.authorization.split(" ")[1]
    try {
      const user = await jwt.verify(token, process.env.SECREATE_KEY);
      req.user = user
    } catch (err) {
      return res.status(401).send({ message: "Authorisation Required" })
    }
  } else {
    return res.status(401).send({ message: "Authorisation Required" })
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
