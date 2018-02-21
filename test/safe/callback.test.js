let testDouble, returnValue, callbackInvoked, er, results, invokedSynchronously
module.exports = {
  beforeEach: () => {
    testDouble = td.func()
  },
  'callback is synchronous': {
    'VERBOSE: using td.callback() as a matcher with a thenReturn chain': () => {
      td.when(testDouble('/foo', td.callback(null, 'some results'))).thenReturn('pandas')

      returnValue = testDouble('/foo', (e, r) => {
        callbackInvoked = true
        er = e
        results = r
      })

      assert.strictEqual(callbackInvoked, true)
      assert.strictEqual(er, null)
      assert.equal(results, 'some results')
      assert.equal(returnValue, 'pandas')
    },
    'TERSE: use thenCallback chain with td.callback implied as last arg': () => {
      td.when(testDouble('/foo')).thenCallback(null, 'some results')

      returnValue = testDouble('/foo', (e, r) => {
        callbackInvoked = true
        er = e
        results = r
      })

      assert.strictEqual(callbackInvoked, true)
      assert.strictEqual(er, null)
      assert.equal(results, 'some results')
      assert.strictEqual(returnValue, undefined)
    },
    'ORDER-EXPLICIT: use td.callback as a marker with a thenCallback chain': () => {
      td.when(testDouble('/foo', td.callback)).thenCallback(null, 'some results')

      returnValue = testDouble('/foo', (e, r) => {
        callbackInvoked = true
        er = e
        results = r
      })

      assert.strictEqual(callbackInvoked, true)
      assert.strictEqual(er, null)
      assert.equal(results, 'some results')
      assert.strictEqual(returnValue, undefined)
    },
    'EDGE CASE: use td.callback() as a matcher with a thenCallback chain (callback() wins)': () => {
      td.when(testDouble('/foo', td.callback('lolz'))).thenCallback(null, 'some results')

      returnValue = testDouble('/foo', (e, r) => {
        callbackInvoked = true
        er = e
        results = r
      })

      assert.equal(er, 'lolz')
      assert.strictEqual(results, undefined)
    },
    'EDGE CASE: Multiple td.callbacks, some markers and some matchers': () => {
      let cb1arg1, cb2arg1
      td.when(testDouble('/bar', td.callback('neat'), td.callback, 'hi')).thenCallback('perfect')

      testDouble('/bar', arg => { cb1arg1 = arg }, arg => { cb2arg1 = arg }, 'hi')

      assert.equal(cb1arg1, 'neat')
      assert.equal(cb2arg1, 'perfect')
    },
    'EDGE CASE: use td.callback as a marker with thenReturn (no-arg invocation is made)': () => {
      td.when(testDouble('/foo', td.callback)).thenReturn(null)

      returnValue = testDouble('/foo', (e, r) => {
        callbackInvoked = true
        er = e
        results = r
      })

      assert.strictEqual(callbackInvoked, true)
      assert.strictEqual(er, undefined)
      assert.strictEqual(results, undefined)
    },
    'EDGE CASE: thenCallback used but not satisfied': () => {
      td.when(testDouble('/bar')).thenCallback('a-ha')
      td.when(testDouble('/bar')).thenReturn('o_O')

      const result = testDouble('/bar')

      assert.equal(result, 'o_O')
    }
  },
  'callback is asynchronous': {
    'using the defer option': {
      'like this': (done) => {
        td.when(testDouble('/A'), {defer: true}).thenCallback(null, 'B')

        testDouble('/A', (e, r) => {
          callbackInvoked = true
          results = r
          done()
        })
        if (results) invokedSynchronously = true
      },
      afterEach: () => {
        assert.strictEqual(callbackInvoked, true)
        assert.equal(results, 'B')
        assert.strictEqual(invokedSynchronously, undefined)
      }
    },
    'using the delay option': {
      'like this': (done) => {
        td.when(testDouble('/A'), {delay: 40}).thenCallback(null, 'B')
        td.when(testDouble('/C'), {delay: 20}).thenCallback(null, 'D')
        td.when(testDouble('/E'), {delay: 30}).thenResolve('F')
        td.when(testDouble('/G'), {delay: 10}).thenReject('H')
        results = []

        testDouble('/A', (er, result) => {
          results.push(result)
          if (results.length === 4) done()
        })

        testDouble('/C', (er, result) => {
          results.push(result)
          if (results.length === 4) done()
        })

        testDouble('/E').then((result) => {
          results.push(result)
          if (results.length === 4) done()
        })

        testDouble('/G').catch((error) => {
          results.push(error)
          if (results.length === 4) done()
        })

        if (results.length > 0) invokedSynchronously = true
      },
      afterEach: () => {
        assert.deepEqual(results, ['H', 'D', 'F', 'B'])
        assert.strictEqual(invokedSynchronously, undefined)
      }
    }
  }
}
