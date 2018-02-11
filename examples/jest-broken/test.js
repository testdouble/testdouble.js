const td = require('../..')
const expect = require('expect')

let subject
describe('td.replace', () => {
  it('will not have td.mock defined b/c no testdouble-jest', () => {
    expect(td.mock).toBeFalsy()
  })
  it('will fail when we attempt to td.replace bar', () => {
    expect(() => {
      td.replace('./bar')
    }).toThrow('Error: testdouble.js - td.replace - It appears the test is being run by Jest, but the testdouble-jest module has not been initialized, so testdouble.js cannot replace modules. For setup instructions, visit: https://github.com/testdouble/testdouble-jest')
  })
  afterEach(() => {
    td.reset()
  })
})

