import Double from '../../../src/value/double'
import Call from '../../../src/value/call'
import Stubbing from '../../../src/value/stubbing'

let findLastStubbingMatch, executePlan, subject
module.exports = {
  beforeEach: () => {
    findLastStubbingMatch = td.replace('../../../src/satisfy/find-last-stubbing-match').default
    executePlan = td.replace('../../../src/satisfy/execute-plan').default

    subject = require('../../../src/satisfy').default
  },
  'finds the last stubbing & returns the executed plan': () => {
    const double = Double.create()
    const call = new Call()
    const stubbing = new Stubbing()
    td.when(findLastStubbingMatch(double, call)).thenReturn(stubbing)
    td.when(executePlan(double, call, stubbing)).thenReturn('huzzah')

    const result = subject(double, call)

    assert.equal(result, 'huzzah')
  },
  'does nothing if no matching stubbing found': () => {
    const double = Double.create()
    const call = new Call()
    td.when(findLastStubbingMatch(double, call)).thenReturn(undefined)

    const result = subject(double, call)

    assert.equal(result, undefined)
    assert.equal(td.explain(executePlan).callCount, 0)
  }
}
