return unless NODE_JS

describe 'log', ->
  Given -> @subject = requireSource('log')

  describe '.warn', ->
    Given -> @ogWarn = console.warn
    afterEach -> console.warn = @ogWarn

    context 'when console.warn is a thing', ->
      Given -> @warnings = []
      Given -> console.warn = (msg) => @warnings.push(msg)

      context 'no URL', ->
        When -> @subject.warn('td.someFunc','ugh')
        Then -> @warnings[0] == 'Warning: testdouble.js - td.someFunc - ugh'

      context 'with a documentation URL', ->
        When -> @subject.warn('td.someFunc','ugh', 'http?')
        Then -> @warnings[0] == 'Warning: testdouble.js - td.someFunc - ugh (see: http? )'

      context 'with td.config({ignoreWarnings: true})', ->
        Given -> td.config(ignoreWarnings: true)
        When -> @subject.warn('waaaarning')
        Then -> @warnings.length == 0

    context 'when console.warn does not exist', ->
      Given -> console.warn = undefined
      When -> @subject.warn('lolololol', 'lol')
      Then -> #nothing explodes

    context 'when console does not exist', ->
      Given -> @ogConsole = console
      Given -> delete global.console
      When -> @subject.warn('lolololol', 'lol')
      Then -> #nothing explodes
      afterEach -> global.console = @ogConsole

  describe '.error', ->
    context 'suppressErrors: true', ->
      Given -> td.config(suppressErrors: true)
      When -> @subject.error('hi','hi')
      Then -> # nothing happens

    context 'without url', ->
      When -> try
          @subject.error('td.lol', 'oops')
        catch e
          @error = e
      Then -> @error.message = "Error: testdouble.js - td.lol - oops"

    context 'with url', ->
      When -> try
          @subject.error('td.lol', 'oops', 'ftp:')
        catch e
          @error = e
      Then -> @error.message = "Error: testdouble.js - td.lol - oops (see: ftp:)"


  describe '.fail', ->
    When -> try
        @subject.fail('boom. failed.')
      catch e
        @error = e
    Then -> @error.message == 'boom. failed.'
