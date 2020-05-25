import tdFunction from './function'
import object from './object'
import constructor from './constructor'
import instance from './instance'
import imitate from './imitate'
import when from './when'
import verify from './verify'
import matchers from './matchers'
import replace, { replaceEsm } from './replace'
import explain from './explain'
import reset from './reset'
import config from './config'
import callback from './callback'
import version from './version'
import * as quibble from 'quibble'

module.exports = {
  function: tdFunction,
  func: tdFunction,
  object,
  constructor,
  instance,
  imitate,
  when,
  verify,
  matchers,
  replace,
  replaceEsm,
  explain,
  reset,
  config,
  callback,
  version,
  quibble
}
