module.exports =
  create: require('./create')
  when: require('./when')
  verify: require('./verify')
  matchers: require('./matchers')
  explain: require('./explain')
  version: process.env.npm_package_version || require('../package.json').version
