let config, subject
module.exports = {
  beforeEach: () => {
    td.replace(console, 'warn')
    config = td.replace('../../src/config').default

    subject = require('../../src/log').default
  },
  '.warn': {
    'not ignoring warnings': () => {
      td.when(config()).thenReturn({ignoreWarnings: false})

      subject.warn('aFunc', 'a message', 'http://url')

      td.verify(console.warn('Warning: testdouble.js - aFunc - a message (see: http://url )'))
    },
    'ignoring warnings': () => {
      td.when(config()).thenReturn({ignoreWarnings: true})

      subject.warn('aFunc', 'a message', 'http://url')

      assert.equal(td.explain(console.warn).callCount, 0)
    }
  },
  '.error': {
    'not suppressing errors': () => {
      td.when(config()).thenReturn({suppressErrors: false})

      assert.throws(() => {
        subject.error('aFunc', 'a message', 'http://url')
      }, /Error: testdouble\.js - aFunc - a message \(see: http:\/\/url \)/)
    },
    'suppressing errors': () => {
      td.when(config()).thenReturn({suppressErrors: true})

      assert.doesntThrow(() => {
        subject.error('aFunc', 'a message', 'http://url')
      })
    }
  },
  '.fail just blows up': () => {
    assert.throws(() => {
      subject.fail('Just boom')
    }, /Just boom/)
  }
}
