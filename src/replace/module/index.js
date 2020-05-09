import * as quibble from 'quibble'

import imitate from '../../imitate'
import jestModule from './jest-module'
import requireActual from './require-actual'
import fakeName from './fake-name'

quibble.ignoreCallsFromThisFile()

export default function replaceCjsModule (path, stub) {
  if (typeof jest === 'object') return jestModule(...arguments)
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = requireActual(path)
  const fakeThing = imitate(realThing, fakeName(path, realThing))
  quibble(path, fakeThing)
  return fakeThing
}

export async function replaceEsModule (path, namedExportsStub, defaultExportStub) {
  if (typeof jest === 'object') {
    throw new Error(`stubbing ES modules (${path}) under Jest is not yet supported`)
  }
  if (arguments.length > 1) {
    return quibble.esm(path, namedExportsStub, defaultExportStub)
  }

  const { modulePath, module } = await quibble.esmImportWithPath(path)
  const { default: fakeDefaultExport = undefined, ...fakeNamedExports } =
    imitate(module, fakeName(path, module))

  await quibble.esm(modulePath, fakeNamedExports, fakeDefaultExport)

  return { default: fakeDefaultExport, ...fakeNamedExports }
}
