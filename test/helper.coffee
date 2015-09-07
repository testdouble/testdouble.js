global.expect = require('chai').expect
global.context = describe
global.requireSubject = (path) -> require("#{process.cwd()}/#{path}")
