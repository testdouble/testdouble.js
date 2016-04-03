global.expect = require('chai').expect;
global.context = describe;
global.td = require('testdouble');

var version = require('semver')(process.version);
if(version.major == 0 && version.minor < 11) {
  console.warn("SKIPPING TESTS: This example requires Node.js 0.11 or higher.");
  process.exit(0);
}

afterEach(function(){
  td.reset();
});
