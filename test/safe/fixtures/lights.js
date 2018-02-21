module.exports = {
  count: 4,
  headlight: function () {
    throw 'headlight' // eslint-disable-line
  },
  turnSignal: function () {
    throw 'turnSignal' // eslint-disable-line
  },
  brights: class Brights {
    beBright () {
      throw 'too bright!' // eslint-disable-line
    }
  }
}
