import config from '../config'
import log from '../log'

const MESSAGES = {
  warn: `\
no promise constructor is set, so this \`thenResolve\` or \`thenReject\` stubbing
will fail if it's satisfied by an invocation on the test double. You can tell
testdouble.js which promise constructor to use with \`td.config\`, like so:`,
  error: `\
no promise constructor is set (perhaps this runtime lacks a native Promise
function?), which means this stubbing can't return a promise to your
subject under test, resulting in this error. To resolve the issue, set
a promise constructor with \`td.config\`, like this:`
}

export default function ensurePromise (level) {
  if (config().promiseConstructor == null) {
    log[level]('td.when', `\
${MESSAGES[level]}

  td.config({
    promiseConstructor: require('bluebird')
  })\
`
    )
  }
}
