import callback from './matchers/callback'
import config from './config'
import constructor from './constructor'
import explain from './explain'
import matchers from './matchers'
import object from './object'
import replace from './replace'
import reset from './reset'
import tdFunction from './function'
import verify from './verify'
import version from './version'
import when from './when'

module.exports = {
  function: tdFunction,
  func: tdFunction,
  object,
  constructor,
  when,
  verify,
  matchers,
  replace,
  explain,
  reset,
  config,
  callback,
  version
}
