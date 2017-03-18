import imitate from './imitate'
import quibble from 'quibble'

quibble.ignoreCallsFromThisFile()

export default function (path, stub) {
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = require(quibble.absolutify(path))
  const fakeThing = imitate(realThing, path)
  quibble(path, fakeThing)
  return fakeThing
}
