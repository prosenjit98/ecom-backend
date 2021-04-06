const { check, validationResult } = require('express-validator')

exports.validateSignupRequest = [
  check('firstName').notEmpty().withMessage('first Name require'),
  check('lastName').notEmpty().withMessage('last Name require'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password min 6 char'),
]

exports.validateSigninRequest = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password min 6 char'),
]

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req) /*retrun array of error after validing by express-validator */
  if (errors.array().length > 0) return res.status(400).send({ errors: errors.array()[0].msg });
  next()
}