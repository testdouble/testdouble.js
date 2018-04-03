import _ from '../wrap/lodash'
import * as path from 'path'
import * as quibble from 'quibble'

import jestModule from './jest-module'
import imitate from '../imitate'

quibble.ignoreCallsFromThisFile()

export default function (path: string, stub?, ...rest) {
  if (typeof jest === 'object') return jestModule(path, stub, ...rest)
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = requireAt(path)
  const fakeThing = imitate(realThing, `${path}: ${nameFor(realThing)}`)
  quibble(path, fakeThing)
  return fakeThing
}

const nameFor = (realThing: Function) => {
  if (!_.isFunction(realThing)) return ''
  return realThing.name ? realThing.name : '(anonymous function)'
}

const requireAt = (modulePath) => {
  try {
    // 1. Try just following quibble's inferred path
    return require(quibble.absolutify(modulePath))
  } catch (e) {
    // 2. Try including npm packages
    return require(require.resolve(modulePath, { paths: [
      path.join(process.cwd(), 'node_modules')
    ]}))
  }
}
