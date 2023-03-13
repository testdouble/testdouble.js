import subject from '../../src/log'

let ogWarn, warnings
module.exports = {
  '.warn': {
    beforeEach () {
      ogWarn = console.warn
    },
    afterEach () {
      console.warn = ogWarn
    },
    'when console.warn is a thing': {
      beforeEach () {
        warnings = []
        console.warn = function (msg) {
          warnings.push(msg)
        }
      },
      'no URL' () {
        subject.warn('td.someFunc', 'ugh')

        assert._isEqual(warnings[0], 'Warning: testdouble.js - td.someFunc - ugh')
      },
      'with a documentation URL' () {
        subject.warn('td.someFunc', 'ugh', 'http?')

        assert._isEqual(warnings[0], 'Warning: testdouble.js - td.someFunc - ugh (see: http? )')
      },
      'with td.config({ignoreWarnings: true})' () {
        td.config({ ignoreWarnings: true })

        subject.warn('waaaarning')

        assert._isEqual(warnings.length, 0)
      }
    },
    'when console.warn does not exist' () {
      console.warn = null

      subject.warn('lolololol', 'lol')

      // No explosions occur
    },
    'when console does not exist' () {
      const ogConsole = console
      delete globalThis.console

      subject.warn('lolololol', 'lol')

      // No explosions occur
      globalThis.console = ogConsole
    }
  },
  '.error': {
    'suppressErrors: true' () {
      td.config({ suppressErrors: true })

      subject.error('hi', 'hi')

      // It does not actually fail
    },
    'without url' () {
      let e
      try {
        subject.error('td.lol', 'oops')
      } catch (error) {
        e = error
      }

      assert._isEqual(e.message, 'Error: testdouble.js - td.lol - oops')
    },
    'with url' () {
      let e
      try {
        subject.error('td.lol', 'oops', 'ftp:')
      } catch (error) {
        e = error
      }

      assert._isEqual(e.message, 'Error: testdouble.js - td.lol - oops (see: ftp: )')
    }
  },
  '.fail' () {
    let e
    try {
      subject.fail('boom. failed.')
    } catch (error) {
      e = error
    }

    assert._isEqual(e.message, 'boom. failed.')
  }
}
