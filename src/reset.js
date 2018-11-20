import _ from './wrap/lodash'
import * as quibble from 'quibble'
import store from './store'

let onResetHandlers = []
let onNextResetHandlers = []

export default _.tap(() => {
  store.reset()
  quibble.reset()
  _.each(onResetHandlers, (resetHandler) =>
    resetHandler())
  _.each(onNextResetHandlers, (resetHandler) =>
    resetHandler())
  onNextResetHandlers = []
}, (reset) => {
  reset.onReset = (func) =>
    onResetHandlers.push(func)

  reset.onNextReset = (func) =>
    onNextResetHandlers.push(func)
})
