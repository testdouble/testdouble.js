import imitate from './imitate'
import quibble from 'quibble'
import resolve from 'resolve'

quibble.ignoreCallsFromThisFile()

export default function (path, stub) {
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = require(resolve.sync(quibble.absolutify(path), {basedir: process.cwd()}))
  const fakeThing = imitate(realThing, path)
  quibble(path, fakeThing)
  return fakeThing
}
