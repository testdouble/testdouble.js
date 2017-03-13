let _ = require('./util/lodash-wrap');
let stringifyAnything = require('./stringify/anything');

const DEFAULTS = {
  promiseConstructor: global.Promise,
  ignoreWarnings: false,
  suppressErrors: false
};

let config = _.extend({}, DEFAULTS);

module.exports = function(overrides) {
  ensureOverridesExist(overrides);
  return _.extend(config, overrides);
};

module.exports.reset = () => config = _.extend({}, DEFAULTS);

var ensureOverridesExist = overrides =>
  _.each(overrides, function(val, key) {
    if (!config.hasOwnProperty(key)) {
      return require('./log').error("td.config", `\"${key}\" is not a valid configuration key (valid keys are: ${stringifyAnything(_.keys(config))})`);
    }
  })
;
