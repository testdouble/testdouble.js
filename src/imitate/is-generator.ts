const generatorsAreSupported = (function () {
  try {
    // tslint:disable-next-line:no-eval
    eval('(function* () {})')
    return true
  } catch (e) {
    return false
  }
})()

const GeneratorFunction = (function () {
  if (!generatorsAreSupported) return
  // tslint:disable-next-line:no-eval
  const func = eval('(function* () {})')
  return Object.getPrototypeOf(func).constructor
})()

export default (func) =>
  generatorsAreSupported && func.constructor === GeneratorFunction
