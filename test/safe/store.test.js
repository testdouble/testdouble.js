import subject from '../../src/store'

let result
module.exports = {
  '.onReset' () {
    subject.onReset(() => { result = 'yay' })

    subject.reset()

    assert._isEqual(result, 'yay')
  }
}
