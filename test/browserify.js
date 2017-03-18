require('mocha-given/browser/mocha-given')

global.td = require('../src/testdouble')

require('./general-helper')
require('./browser-helper')

require('./src/**/*.js', {mode: 'expand'})
require('./src/**/*.coffee', {mode: 'expand'})
