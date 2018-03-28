import _ from './wrap/lodash'
import * as quibble from 'quibble'
import store from './store'

let resetHandlers = []

interface Reset {
  (): void
  onNextReset: (cb: () => void) => void
}

export default _.tap((() => {
  store.reset()
  quibble.reset()
  _.each(resetHandlers, (resetHandler) =>
    resetHandler())
  resetHandlers = []
}) as Reset, (reset) => {
  reset.onNextReset = (func) =>
    resetHandlers.push(func)
})
