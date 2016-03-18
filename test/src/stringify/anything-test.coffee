return unless NODE_JS


describe 'stringify/anything', ->
  Given -> @subject = require('../../../src/stringify/anything')
  Then -> @subject(undefined) == "undefined"
  And -> @subject(null) == "null"
  And -> @subject(0) == "0"
  And -> @subject("foo") == '"foo"'
