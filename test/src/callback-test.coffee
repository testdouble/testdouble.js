describe 'td.callback', ->
  Given -> @testDouble = td.function()

  describe 'when', ->
    When -> @returnValue = @testDouble '/foo', (er, results) =>
      @callbackInvoked = true
      @er = er
      @results = results

    context 'VERBOSE: using td.callback() as a matcher with a thenReturn chain', ->
      Given -> td.when(@testDouble('/foo', td.callback(null, 'some results'))).thenReturn('pandas')
      Then -> @er == null
      And -> @results == 'some results'
      And -> @returnValue == 'pandas'

    context 'TERSE: use thenCallback chain with td.callback implied as last arg', ->
      Given -> td.when(@testDouble('/foo')).thenCallback(null, 'some results')
      Then -> @callbackInvoked = true
      And -> @er == null
      And -> @results == 'some results'
      And -> @returnValue == undefined

    context 'ORDER-EXPLICIT: use td.callback as a marker with a thenCallback chain', ->
      Given -> td.when(@testDouble('/foo', td.callback)).thenCallback(null, 'some results')
      Then -> @er == null
      And -> @results == 'some results'
      And -> @returnValue == undefined

    context 'EDGE CASE: use td.callback() as a matcher with a thenCallback chain (callback() wins)', ->
      Given -> td.when(@testDouble('/foo', td.callback('lolz'))).thenCallback(null, 'some results')
      Then -> @er == 'lolz'
      And -> @results == undefined

    context 'EDGE CASE: Multiple td.callbacks, some markers and some matchers', ->
      Given -> td.when(@testDouble('/bar', td.callback('neat'), td.callback, 'hi')).thenCallback('perfect')
      When -> @testDouble('/bar', ((@cb1arg1) =>), ((@cb2arg1) =>), 'hi')
      Then -> @cb1arg1 == 'neat'
      And -> @cb2arg1 == 'perfect'

    context 'EDGE CASE: use td.callback as a marker with thenReturn (no-arg invocation is made)', ->
      Given -> td.when(@testDouble('/foo', td.callback)).thenReturn(null)
      Then -> @er == undefined
      And -> @results == undefined
      And -> @callbackInvoked == true

    context 'EDGE CASE: thenCallback used but not satisfied', ->
      Given -> td.when(@testDouble('/bar')).thenCallback('a-ha')
      Given -> td.when(@testDouble('/bar')).thenReturn('o_O')
      When -> @result = @testDouble('/bar')
      Then -> @result == 'o_O'

  describe 'verify???? what would that mean', ->

