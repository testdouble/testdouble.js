import subject from '../../../src/matchers/notify-after-satisfaction'

import createMatcher from '../../../src/matchers/create'

module.exports = {
  'some args and one is a matcher': function () {
    const afterSatisfaction = td.func('hook')
    const matcher = createMatcher({
      matches: () => true,
      afterSatisfaction
    })

    subject([5, matcher('lol')], [5, 'whatever'])

    td.verify(afterSatisfaction(['lol'], 'whatever'))
  }
}
