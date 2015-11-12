module.exports =
  function: require('./function')
  object: require('./object')
  when: require('./when')
  verify: require('./verify')
  matchers: require('./matchers/index')
  explain: require('./explain')
  replace: require('./replace')
  reset: require('./reset')
  version: process.env.npm_package_version || require('../package.json').version
