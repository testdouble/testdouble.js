var expect = require('chai').expect;
var td = require('../..')

afterEach(function(){
  td.reset()
})

describe('sample Mocha test', () => {
  it('passes', () => {
    expect(true).to.be.true
  })
})
