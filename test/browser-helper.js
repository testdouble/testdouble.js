require('mocha-given/browser/mocha-given')
mocha.setup('mocha-given')
global.NODE_JS = false

global.td = require('../src/testdouble')
require('./general-helper')
