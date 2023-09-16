const { canRegisterLoader } = require('../../lib/can-register-loader')

if (process.argv[2] === 'not') {
  process.exit(!canRegisterLoader() ? 0 : 1)
}
process.exit(canRegisterLoader() ? 0 : 1)
