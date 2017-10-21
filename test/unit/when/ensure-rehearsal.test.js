import Call from '../../../src/value/call'

let log, subject
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default

    subject = require('../../../src/when/ensure-rehearsal').default
  },
  'no rehearsal raises error': () => {
    subject(null)

    td.verify(log.error('td.when', `\
No test double invocation call detected for \`when()\`.

  Usage:
    when(myTestDouble('foo')).thenReturn('bar')\
`
    ))
  },
  'with rehearsal does nothing': () => {
    const call = new Call()

    subject(call)

    assert.equal(td.explain(log.error).callCount, 0)
  }

}
