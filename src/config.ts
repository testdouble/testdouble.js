import _ from './wrap/lodash'
import log from './log'
import stringifyAnything from './stringify/anything'

const DEFAULTS = {
  ignoreWarnings: false,
  promiseConstructor: global.Promise,
  suppressErrors: false
}
const DELETED_OPTIONS = ['extendWhenReplacingConstructors']

let configData = _.extend({}, DEFAULTS)

export default _.tap((overrides) => {
  deleteDeletedOptions(overrides)
  ensureOverridesExist(overrides)
  return _.extend(configData, overrides)
}, (config) => {
  config.reset = () => {
    configData = _.extend({}, DEFAULTS)
  }
})

const deleteDeletedOptions = (overrides) => {
  _.each(overrides, (val, key) => {
    if (_.includes(DELETED_OPTIONS, key)) {
      log.warn('td.config', `"${key}" is no longer a valid configuration key. Remove it from your calls to td.config() or it may throw an error in the future. For more information, try hunting around our GitHub repo for it:\n\n  https://github.com/testdouble/testdouble.js/search?q=${key}`)
      delete overrides[key]
    }
  })
}

var ensureOverridesExist = (overrides) => {
  _.each(overrides, (val, key) => {
    if (!configData.hasOwnProperty(key)) {
      log.error('td.config',
        `"${key}" is not a valid configuration key (valid keys are: ${stringifyAnything(_.keys(configData))})`)
    }
  })
}
