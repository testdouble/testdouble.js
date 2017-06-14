let log, subject
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/wrap/log').default
    subject = require('../../../src/when/ensure-rehearsal').default
  },
  'call is truthy': () => {
    subject({})

    assert.equal(td.explain(log.error).callCount, 0)
  },
  'call is falsey': () => {
    subject(undefined)

    td.verify(log.error('td.when', `\
No test double invocation call detected for \`when()\`.

  Usage:
    when(myTestDouble('foo')).thenReturn('bar')\
`))
  }
}
