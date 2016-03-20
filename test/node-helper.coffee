sourceDir = if process.env.COVER?
  process.env.COVER
else
  'src'

global.requireSource = (path) ->
  require("#{process.cwd()}/#{sourceDir}/#{path}")

global.td = requireSource('testdouble')
global.chai = require('chai')
global.NODE_JS = true


require('./general-helper')
