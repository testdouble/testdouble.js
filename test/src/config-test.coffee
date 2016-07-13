describe 'td.config', ->
  context 'defaults', ->
    Given -> @config = td.config()
    Then -> expect(@config).to.deep.equal
      promiseConstructor: global.Promise
      ignoreWarnings: false
      suppressErrors: false

  context 'overriding', ->
    Given -> @config = td.config(ignoreWarnings: true)
    Then -> @config.ignoreWarnings == true
    And -> td.config().ignoreWarnings == true

  context 'overriding a non-existent property', ->
    Given -> try
        @config = td.config(wat: 'wat?')
      catch e
        @error = e
    Then -> @error.message == 'Error: testdouble.js - td.config - "wat" is not a valid configuration key (valid keys are: ["promiseConstructor", "ignoreWarnings", "suppressErrors"])'
