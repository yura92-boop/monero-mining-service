const {
  STEALTHEX: { API_KEY, BASE_URL }
} = require('../consts')
const axios = require('axios')

const get = async (uri, query) => {
  const { data: response } = await axios.get(BASE_URL + uri, {
    params: { api_key: API_KEY, ...query }
  })
  return response
}
const post = async (uri, body) => {
  const { data: response } = await axios.post(BASE_URL + uri, body, {
    params: { api_key: API_KEY }
  })
  return response
}

/**
 * Process Block Reward function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

exports.availableCurrenciesWithXMR = async () => {
  return await get('pairs/xmr')
}

exports.transfer = async (address, currency, amount) => {
  try {
    const exchange = await post('exchange', {
      currency_from: 'xmr', // Monero token
      currency_to: currency,
      address_to: address,
      amount_from: amount
    })
    if (amount !== Number(exchange.expected_amount)) {
      throw new Error('Something went wrong!')
    }
    // transfer from process.env.MONERO_MINER_WALLET to exchange.address_from
    return exchange
  } catch (err) {
    console.log(err.message)
    return null
  }
}

exports.estimateExchange = async (from, to, amount) => {
  const response = await get(`estimate/${from}/${to}`, { amount })
  return response?.estimated_amount || 0
}
