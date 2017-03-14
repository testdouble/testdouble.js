let _ =
  {map: require('lodash/map')}

let stringifyAnything = require('./anything')

module.exports = function (args, joiner, wrapper) {
  if (joiner == null) { joiner = ', ' }
  if (wrapper == null) { wrapper = '' }
  return _.map(args, arg => `${wrapper}${stringifyAnything(arg)}${wrapper}`).join(joiner)
}
