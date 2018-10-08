import path from 'path'
import * as quibble from 'quibble'
import * as theredoc from 'theredoc'

import log from '../../log'

quibble.ignoreCallsFromThisFile()

export default function requireActual (modulePath) {
  const absolutePath = quibble.absolutify(modulePath)
  let absolutePathLoadError, moduleNameLoadError

  // 1. Try just following quibble's inferred absolute path
  try {
    return require(absolutePath)
  } catch (e) {
    absolutePathLoadError = e
  }

  // 2. Try requiring a built-in or npm module of the given `modulePath` name
  try {
    return require(require.resolve(modulePath, { paths: [
      path.join(process.cwd(), 'node_modules')
    ] }))
  } catch (e) {
    moduleNameLoadError = e
  }

  // 3. Give up, print a fancy error
  log.error('td.replace', theredoc`
    failed to load the module being replaced.

    Why am I seeing this?
    ------------------------
    You called \`td.replace('${modulePath}')\`, but we failed to locate that
    module. How td.replace() works is that it first loads the actual module
    being faked in order to properly imitate it (i.e. to see whether it exports
    a default function, or an object of other named functions, and so on).

    How do I fix it?
    ----------------
    You probably specified a path that could not be resolved relative
    to your test file (or whatever listing from which you called \`td.replace()\`).
    Be sure you didn't specify the path relative to the subject under test!

    First, we tried to absolutify that path and require it, with:
      \`require('${absolutePath}')\`

    But requiring that absolute path threw this error:
      "${absolutePathLoadError.message}"

    Next, we tried to require it as you specified it (in case it's the name of
    a Node.js built-in or an npm package), with:
      \`require('${modulePath}')\`

    But that threw this error:
      "${moduleNameLoadError.message}"

    Make sure the path specified exists (either relative to the call-site or
    as an installed module). If any of the paths above seem to be internal to
    testdouble.js or a dependency, that's probably a bug and you should open an
    issue.
  `, 'https://github.com/testdouble/testdouble.js#module-replacement-with-nodejs')
}
