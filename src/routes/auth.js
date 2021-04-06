const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { requireSignin } = require('../common-middleware')
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validitors/auth');


router.post('/signin', validateSigninRequest, isRequestValidated, signin)

router.post('/signup', validateSignupRequest, isRequestValidated, signup)

router.post('/profile', requireSignin, (req, res) => {
    res.status(200).send({ user: req.body.user })
})

module.exports = router