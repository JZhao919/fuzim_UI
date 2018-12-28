'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://easy-mock.com/mock/5b751c7029726d50328181f6/api"',
})

// https://easy-mock.com/mock/5b751c7029726d50328181f6/api //测试地址
// http://116.62.231.150:8080/templefuzi