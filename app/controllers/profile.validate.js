const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')
const validationUtil = require('../../utils/validation')

/**
 * Validates update profile request
 */
exports.updateProfile = [
  check('name')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('phone')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),

  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates change password request
 */
exports.changePassword = [
  check('oldPassword')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('newPassword')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
