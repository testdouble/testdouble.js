import subject from '../../src/store'

let result
module.exports = {
  '.onReset' () {
    subject.onReset(() => { result = 'yay' })

    subject.reset()

    assert._isEqual(result, 'yay')
  },
  '.onReset runs listeners in the order they were added' () {
    const calls = []
    subject.onReset(() => calls.push(1))
    subject.onReset(() => calls.push(2))

    subject.reset()

    assert._isEqual(calls, [1, 2])
  }
}
