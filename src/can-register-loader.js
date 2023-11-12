const Module = require('module')

function canRegisterLoader () {
  return !!Module.register
}

exports.canRegisterLoader = canRegisterLoader
