import config from '../config'
import ensurePromise from '../log/ensure-promise'
import callLater from '../share/call-later'

export default function createPromise (stubbing, willResolve) {
  const Promise = config().promiseConstructor
  ensurePromise('error')
  const value = stubbing.currentOutcome
  return new Promise((resolve, reject) => {
    callLater(() =>
      willResolve ? resolve(value) : reject(value)
    , [value], stubbing.options.defer, stubbing.options.delay)
  })
}
