const express = require('express')
const router = express.Router();
const { signup, signin, signout } = require('../../controllers/admin/auth');
const { requireSignin } = require("../../common-middleware")
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validitors/auth');


router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin)

router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup)
router.post('/admin/signout', signout)

router.post('/admin/profile', requireSignin, (req, res) => {
    res.status(200).send({ user: req.body.user })
})

module.exports = router