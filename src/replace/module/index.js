import * as quibble from 'quibble'

import imitate from '../../imitate'
import jestModule from './jest-module'
import requireActual from './require-actual'
import fakeName from './fake-name'

quibble.ignoreCallsFromThisFile()

export default function replaceModule (path, stub) {
  if (typeof jest === 'object') return jestModule(...arguments)
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = requireActual(path)
  const fakeThing = imitate(realThing, fakeName(path, realThing))
  quibble(path, fakeThing)
  return fakeThing
}
