const generatorsAreSupported = (function () {
  try {
    eval('(function* () {})') // eslint-disable-line
    return true
  } catch (e) {
    return false
  }
})()

const GeneratorFunction = (function () {
  if (!generatorsAreSupported) return
  const func = eval('(function* () {})') // eslint-disable-line
  return Object.getPrototypeOf(func).constructor
})()

export default (func) =>
  generatorsAreSupported && func.constructor === GeneratorFunction
