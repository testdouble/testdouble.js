import {heredoc} from '../../../../src/wrap/common-tags'

import subject from '../../../../src/replace/module/require-actual'

module.exports = {
  'require a relative path' () {
    const thisTestLol = subject('./require-actual.test')

    assert._isEqual(
      thisTestLol['require a relative path'],
      module.exports['require a relative path']
    )
  },
  'require an npm module' () {
    const isNumber = subject('is-number')

    assert._isEqual(isNumber(5), true)
  },
  'print a huge error when both fail' () {
    assert.throwsMessage(() => { subject('./lol/not/real') }, heredoc`
      Error: testdouble.js - td.replace - failed to load the module being replaced.

      Why am I seeing this?
      ------------------------
      You called \`td.replace('./lol/not/real')\`, but we failed to locate that
      module. How td.replace() works is that it first loads the actual module
      being faked in order to properly imitate it (i.e. to see whether it exports
      a default function, or an object of other named functions, and son on).

      How do I fix it?
      ----------------
      You probably specified a relative path that could not be resolved relative
      to your test file (or whatever listing from which  you called
      \`td.replace()\`). Be sure you didn't specify the path relative to the
      subject under test!

      First, we tried to absolutify that path and require it, with:
        \`require('@@@test/unit/replace/module/lol/not/real')\`

      But requiring that absolute path threw this error:
        "Cannot find module '@@@test/unit/replace/module/lol/not/real'"

      Next, we tried to require it as you specified it (in case it's the name of
      a Node.js built-in or an npm package), with:
        \`require('./lol/not/real')\`

      But that threw this error:
        "Cannot read property 'join' of undefined"

      Make sure the path specified exists (either relative to the call-site or
      as an installed module. If any of the paths above seem to be internal to
      testdouble.js or a dependency, that's probably a bug and you should open an
      issue. (see: https://github.com/testdouble/testdouble.js#module-replacement-with-nodejs )
    `)
  }
}
