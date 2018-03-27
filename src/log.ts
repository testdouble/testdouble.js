import config from './config'

export default {
  warn (func: string, msg: string, url?: string) {
    if (!config().ignoreWarnings && typeof console === 'object' && console.warn) {
      console.warn(`Warning: testdouble.js - ${func} - ${msg}${withUrl(url)}`)
    }
  },

  error (func: string, msg: string, url?: string) {
    if (!config().suppressErrors) {
      throw new Error(`Error: testdouble.js - ${func} - ${msg}${withUrl(url)}`)
    }
  },

  fail (msg: string) {
    throw new Error(msg)
  }
}

var withUrl = (url?: string) =>
  url != null
    ? ` (see: ${url} )`
    : ''
