import config from '../config'
import log from '../log'

export default function ensurePromise (level) {
  if (config().promiseConstructor == null) {
    log[level]('td.when', `\
no promise constructor is set, so this \`thenResolve\` or \`thenReject\` stubbing
will fail if it's satisfied by an invocation on the test double. You can tell
testdouble.js which promise constructor to use with \`td.config\`, like so:

  td.config({
    promiseConstructor: require('bluebird')
  })\
`
    )
  }
}
