let subject, ensureDemonstration, didCallOccur, notifySatisfiedMatchers, 
    warnIfAlsoStubbed, fail
module.exports = {
  beforeEach: () => {
    ensureDemonstration = td.replace('../../../src/verify/ensure-demonstration').default
    didCallOccur = td.replace('../../../src/verify/did-call-occur').default
    notifySatisfiedMatchers = td.replace('../../../src/verify/notify-satisfied-matchers').default
    warnIfAlsoStubbed = td.replace('../../../src/verify/warn-if-also-stubbed').default
    fail = td.replace('../../../src/verify/fail').default
    subject = require('../../../src/verify/index').default
  },
  'verified to have occurred as configured': () => {
  },
  'demonstrated call DID NOT occur, failing test': () => {
  },
  'demonstration missing blows up': () => {
  }

}
