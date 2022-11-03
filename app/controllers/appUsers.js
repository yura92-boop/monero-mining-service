const { matchedData } = require('express-validator')
const AppUser = require('../models/appUser')
const User = require('../models/user')
const utils = require('../middleware/utils')


/**
 * Add a new appUser in database
 * @param {Object} req - request object
 */
const installAppUser = async req => {
  let user = null
  try {
    user = await User.findOne({ publisherKey: req.publisherKey })
  } catch (err) {
    throw utils.buildErrObject(500, 'DB_ERROR')
  }
  if (!user) {
    throw utils.buildErrObject(400, 'UNKNOWN_PUBLISHER_KEY')
  }
  try {
    const appUser = AppUser.create({
      ...req,
      publisherId: user.id
    })
    return appUser
  } catch (error) {
    throw utils.buildErrObject(400, err.message)
  }

}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.install = async (req, res) => {
  try {
    req = matchedData(req)
    const appUser = await installAppUser(req)
    res.status(201).json(appUser)
  } catch (error) {
    utils.handleError(res, error)
  }
}
