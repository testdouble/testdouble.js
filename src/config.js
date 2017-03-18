import _ from './util/lodash-wrap'
import log from './log'
import stringifyAnything from './stringify/anything'

const DEFAULTS = {
  promiseConstructor: global.Promise,
  ignoreWarnings: false,
  suppressErrors: false
}
let configData = _.extend({}, DEFAULTS)

export default _.tap((overrides) => {
  ensureOverridesExist(overrides)
  return _.extend(configData, overrides)
}, (config) => {
  config.reset = () => {
    configData = _.extend({}, DEFAULTS)
  }
})

var ensureOverridesExist = (overrides) => {
  _.each(overrides, (val, key) => {
    if (!configData.hasOwnProperty(key)) {
      log.error('td.config',
        `"${key}" is not a valid configuration key (valid keys are: ${stringifyAnything(_.keys(configData))})`)
    }
  })
}
