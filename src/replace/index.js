import _ from '../wrap/lodash'
import * as quibble from 'quibble'
import replaceModule, { replaceEsModule } from './module'
import replaceProperty from './property'

quibble.ignoreCallsFromThisFile()

export default function (target) {
  if (_.isString(target)) {
    return replaceModule(...arguments)
  } else {
    return replaceProperty(...arguments)
  }
}

export function replaceEsm (_modulePath, _namedExportReplacement, _defaultExportReplacement) {
  if (!quibble.isLoaderLoaded()) {
    throw new Error('testdouble ESM loader not loaded. You cannot replace ES modules without a loader. Run node with `--loader=testdouble`.')
  }
  // Sending arguments instead of the above arguments is crucial because `replaceEsModule`
  // uses arguments.length to figure out what to do.
  return replaceEsModule(...arguments)
}
