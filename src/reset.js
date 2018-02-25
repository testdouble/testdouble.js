import _ from './wrap/lodash'
import * as quibble from 'quibble'
import store from './store'

let resetHandlers = []

export default _.tap(() => {
  store.reset()
  quibble.reset()
  _.each(resetHandlers, (resetHandler) =>
    resetHandler())
  resetHandlers = []
}, (reset) => {
  reset.onNextReset = (func) =>
    resetHandlers.push(func)
})
