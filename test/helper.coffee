global.expect = require('chai').expect

global.requireSubject = (path) -> require("#{process.cwd()}/#{path}")
