import * as quibble from 'quibble'
import log from '../../log'

quibble.ignoreCallsFromThisFile()

export default function jestModule (path, stub) {
  const tdMock = require('../../index').mock
  if (!tdMock) {
    log.error('td.replace', 'It appears the test is being run by Jest, but the testdouble-jest module has not been initialized, so testdouble.js cannot replace modules. For setup instructions, visit: https://github.com/testdouble/testdouble-jest')
  } else if (arguments.length > 1) {
    tdMock(path, () => stub, { virtual: !moduleExists(tdMock, path) })
    return tdMock.requireMock(path)
  } else {
    tdMock(path)
    return tdMock.requireMock(path)
  }
}

const moduleExists = function (tdMock, path) {
  try {
    // TODO: figure out how to invoke jest-resolve directly, because
    // this would be much better if we could just resolve the path to
    // learn if it exists. I have to imagine actually requiring the thing is
    // going to cause side effects for people expressly trying to avoid them
    // by passing a manual stub
    tdMock.requireActual(path)
    return true
  } catch (e) {
    return false
  }
}
