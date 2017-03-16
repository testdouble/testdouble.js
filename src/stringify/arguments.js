let _ = require('../util/lodash-wrap')
let stringifyAnything = require('./anything')

module.exports = (args, joiner = ', ', wrapper = '') =>
  _.map(args, arg =>
    `${wrapper}${stringifyAnything(arg)}${wrapper}`
  ).join(joiner)
