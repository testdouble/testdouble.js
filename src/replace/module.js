import imitate from './imitate'
import quibble from 'quibble'
import resolve from 'resolve'

quibble.ignoreCallsFromThisFile()

export default function (path, stub) {
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = requireAt(path)
  const fakeThing = imitate(realThing, path)
  quibble(path, fakeThing)
  return fakeThing
}

var requireAt = (path) => {
  try {
    // 1. Try just following quibble's inferred path
    return require(quibble.absolutify(path))
  } catch (e) {
    // 2. Try including npm packages
    return require(resolve.sync(path, { basedir: process.cwd() }))
  }
}
