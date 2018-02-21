module.exports = {
  GENERATORS: (function () {
    try {
      eval('(function* () {})') // eslint-disable-line
      return true
    } catch (e) {
      return false
    }
  })()
}
