global.expect = require('chai').expect;
global.context = describe;
global.td = require('testdouble');

afterEach(function(){
  td.reset();
});
