global.expect = require('chai').expect;
global.context = describe;
td = require('testdouble');

afterEach(function(){
  td.reset();
});
