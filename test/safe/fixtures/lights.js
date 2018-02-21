module.exports = {
  count: 4,
  headlight: function () {
    throw 'headlight'
  },
  turnSignal: function () {
    throw 'turnSignal'
  },
  brights: class Brights {
    beBright () {
      throw 'too bright!'
    }
  }
}
