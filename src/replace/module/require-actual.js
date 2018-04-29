import path from 'path'
import * as quibble from 'quibble'

quibble.ignoreCallsFromThisFile()

export default function requireActual (modulePath) {
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
