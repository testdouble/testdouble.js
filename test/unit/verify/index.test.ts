import Double from '../../../src/value/double'
import Call from '../../../src/value/call'

let subject, popDemonstration, didCallOccur, notifySatisfiedMatchers,
  warnIfAlsoStubbed, fail
module.exports = {
  beforeEach: () => {
    popDemonstration = td.replace('../../../src/verify/pop-demonstration').default
    didCallOccur = td.replace('../../../src/verify/did-call-occur').default
    notifySatisfiedMatchers = td.replace('../../../src/verify/notify-satisfied-matchers').default
    warnIfAlsoStubbed = td.replace('../../../src/verify/warn-if-also-stubbed').default
    fail = td.replace('../../../src/verify/fail').default
    subject = require('../../../src/verify/index').default
  },
  'verified to have occurred as configured': () => {
    const double = new Double()
    const call = new Call()
    const config = {some: 'option'}
    td.when(popDemonstration()).thenReturn({double, call})
    td.when(didCallOccur(double, call, config)).thenReturn(true)

    subject(/* imagine double('a','b','c') */ undefined, config)

    td.verify(notifySatisfiedMatchers(double, call, config))
    td.verify(warnIfAlsoStubbed(double, call, config))
    assert.equal(td.explain(fail).callCount, 0)
  },
  'demonstrated call DID NOT occur, failing test': () => {
    const double = new Double()
    const call = new Call()
    const config = {some: 'option'}
    td.when(popDemonstration()).thenReturn({double, call})
    td.when(didCallOccur(double, call, config)).thenReturn(false)

    subject(/* imagine double('a','b','X') */ undefined, config)

    td.verify(fail(double, call, config))
    assert.equal(td.explain(notifySatisfiedMatchers).callCount, 0)
    assert.equal(td.explain(warnIfAlsoStubbed).callCount, 0)
  },
  'demonstration missing blows up': () => {
    const config = {some: 'option'}
    td.when(popDemonstration()).thenThrow(new Error('wups'))

    assert.throws(() => {
      subject(/* imagine double('a','b','X') */ undefined, config)
    }, /wups/)

    assert.equal(td.explain(notifySatisfiedMatchers).callCount, 0)
    assert.equal(td.explain(warnIfAlsoStubbed).callCount, 0)
    assert.equal(td.explain(fail).callCount, 0)
  }

}
