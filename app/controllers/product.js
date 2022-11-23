const model = require('../models/userProfile')
const fs = require('fs')
const path = require('path')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')
const uuid = require('uuid')

const { FILE_UPLOAD_DIR } = require('../consts')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.get = async (req, res) => {
  try {
    const product = await model.findById(req.user.userProfileId)
    utils.handleSuccess(res, 200, product)
  } catch (error) {
    utils.handleErrorV2(res, error)
  }
}

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.update = async (req, res) => {
  try {
    const data = matchedData(req)
    const { companyLogo, productIcon } = req.files
    const product = await model.findById(req.user.userProfileId)

    const dirPath = utils.resolveUploadPath(req.user.publisherKey)

    const imgPath = {}

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }

    if (companyLogo) {
      if (
        product.companyLogo &&
        fs.existsSync(utils.resolveUploadPath(product.companyLogo))
      ) {
        try {
          fs.rmSync(utils.resolveUploadPath(product.companyLogo))
        } catch (error) {
          console.log(error)
        }
      }
      imgPath.companyLogo = path.join(
        req.user.publisherKey,
        uuid() + companyLogo.name
      )
      fs.createReadStream(companyLogo.path).pipe(
        fs.createWriteStream(utils.resolveUploadPath(imgPath.companyLogo))
      )
    }

    if (productIcon) {
      if (
        product.productIcon &&
        fs.existsSync(utils.resolveUploadPath(product.productIcon))
      ) {
        try {
          fs.rmSync(utils.resolveUploadPath(product.productIcon))
        } catch (error) {
          console.log(error)
        }
      }
      imgPath.productIcon = path.join(
        req.user.publisherKey,
        uuid() + productIcon.name
      )
      fs.createReadStream(productIcon.path).pipe(
        fs.createWriteStream(utils.resolveUploadPath(imgPath.productIcon))
      )
    }
    utils.crupdateMsi(
      req.user.publisherKey,
      product.companyName,
      data.productName
    )
    utils.handleSuccess(
      res,
      201,
      await model.findByIdAndUpdate(
        product._id,
        {
          productName: data.productName,
          currencyName: data.currencyName,
          userPercentage: data.userPercentage,
          numberOfVirtualCoins: data.numberOfVirtualCoins,
          ...imgPath
        },
        { new: true }
      )
    )
  } catch (error) {
    utils.handleErrorV2(res, error)
  }
}
