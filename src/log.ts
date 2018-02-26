import config from './config'

export default {
  warn (func, msg, url) {
    if (!config().ignoreWarnings && typeof console === 'object' && console.warn) {
      console.warn(`Warning: testdouble.js - ${func} - ${msg}${withUrl(url)}`)
    }
  },

  error (func, msg, url) {
    if (!config().suppressErrors) {
      throw new Error(`Error: testdouble.js - ${func} - ${msg}${withUrl(url)}`)
    }
  },

  fail (msg) {
    throw new Error(msg)
  }
}

var withUrl = (url) =>
  url != null
    ? ` (see: ${url} )`
    : ''
