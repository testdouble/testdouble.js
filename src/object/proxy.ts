import * as theredoc from 'theredoc'
import _ from '../wrap/lodash'
import log from '../log'
import tdFunction from '../function'
import store from '../store'

export default function proxy<T> (name: string, { excludeMethods } : { excludeMethods?: string[] } = {}) : T {
  ensureProxySupport(name)
  return new Proxy({}, generateHandler(name, excludeMethods))
}

const ensureProxySupport = (name) => {
  if (typeof Proxy === 'undefined') {
    log.error('td.object', theredoc`\
      The current runtime does not have Proxy support, which is what
      testdouble.js depends on when a string name is passed to \`td.object()\`.

      More details here:
        https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname

      Did you mean \`td.object(['${name}'])\`?
    `)
  }
}

const generateHandler = (internalName, excludeMethods) => ({
  get (target, propKey) {
    return generateGet(target, propKey, internalName, excludeMethods)
  }
})

const generateGet = (target, propKey, internalName, excludeMethods) => {
  if (!target.hasOwnProperty(propKey) && !_.includes(excludeMethods, propKey)) {
    const nameWithProp = `${internalName || ''}.${String(propKey)}`
    const tdFunc = tdFunction(nameWithProp)
    const tdFuncProxy = new Proxy(tdFunc, generateHandler(nameWithProp, excludeMethods))
    store.registerAlias(tdFunc, tdFuncProxy)
    target[propKey] = tdFuncProxy
  }
  return target[propKey]
}
