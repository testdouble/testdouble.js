import assert from 'node:assert/strict'
import { describe, it, afterEach } from 'node:test'
import * as td from 'testdouble'

// is-number is a dependency of this package only, so pnpm installs it where
// this file can see it but testdouble (in the workspace root's node_modules)
// can't. td.replaceEsm() has to resolve it the way this file would.
describe('numbers-only', function () {
  afterEach(function () {
    td.reset()
  })

  it('replaces a third-party module only this package depends on', async function () {
    const isNumber = (await td.replaceEsm('is-number')).default
    const numbersOnly = (await import('../lib/numbers-only.mjs')).default
    td.when(isNumber('seven')).thenReturn(true)

    assert.strictEqual(numbersOnly('seven'), true)
  })
})
