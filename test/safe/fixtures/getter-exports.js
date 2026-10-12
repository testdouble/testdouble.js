// CommonJS in the shape SWC compiles ES module exports to: every export is a
// non-configurable getter
Object.defineProperty(exports, '__esModule', { value: true })

function doTheThing () {
  return 'real thing'
}

const helpers = {
  beep () { return 'real beep' }
}

Object.defineProperty(exports, 'doTheThing', {
  enumerable: true,
  get: function () { return doTheThing }
})

// A re-export, which Babel and tsc also compile to a getter
Object.defineProperty(exports, 'beep', {
  enumerable: true,
  get: function () { return helpers.beep }
})
