return unless NODE_JS

describe 'warn', ->
  Given -> @subject = requireSource('warn')
  Given -> @ogWarn = console.warn
  afterEach -> console.warn = @ogWarn

  context 'when console.warn is a thing', ->
    Given -> @warnings = []
    Given -> console.warn = (msg) => @warnings.push(msg)

    context 'no URL', ->
      When -> @subject('td.someFunc','ugh')
      Then -> @warnings[0] == 'Warning: testdouble.js - td.someFunc - ugh'

    context 'with a documentation URL', ->
      When -> @subject('td.someFunc','ugh', 'http?')
      Then -> @warnings[0] == 'Warning: testdouble.js - td.someFunc - ugh (see: http? )'

    context 'with td.config({ignoreWarnings: true})', ->
      Given -> td.config(ignoreWarnings: true)
      When -> @subject('waaaarning')
      Then -> @warnings.length == 0

  context 'when console.warn does not exist', ->
    Given -> console.warn = undefined
    When -> @subject('lolololol', 'lol')
    Then -> #nothing explodes

  context 'when console does not exist', ->
    Given -> @ogConsole = console
    Given -> delete global.console
    When -> @subject('lolololol', 'lol')
    Then -> #nothing explodes
    afterEach -> global.console = @ogConsole

