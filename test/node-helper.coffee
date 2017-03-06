sourceDir = if process.env.COVER?
  process.env.COVER
else
  'src'

global.requireSource = (path) ->
  require("#{process.cwd()}/#{sourceDir}/#{path}")

global.td = requireSource('testdouble')
global.chai = require('chai')
global.pry = require('pryjs')

nodeVersion = require('semver')(process.version)

global.NODE_JS =
  AT_LEAST_6: nodeVersion.major >= 6


require('./general-helper')
