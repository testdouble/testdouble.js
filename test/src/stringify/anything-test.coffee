return unless NODE_JS


describe 'stringify/anything', ->
  Given -> @subject = require('../../../src/stringify/anything')
  Then -> @subject(undefined) == "undefined"
  And -> @subject(null) == "null"
  And -> @subject(0) == "0"
  And -> @subject("foo") == '"foo"'
  And -> @subject(false) == 'false'

  context 'short strings of objects should be one-lined', ->
    Then -> expect(@subject({userId: 42, name: 'Jane'})).to.eq('{userId: 42, name: "Jane"}')

  context 'a long weird string should be left-be', ->
    Given -> @longString = """
      ojsaodjasiodjsaodijsado asj asodjaosdj asodjsaoidjsa odjasoidjasodjas
      asdojsadojdosajodsajd saoji joasdjoajsd
      asdjoj

      asdojasdoajsdoasjdaosjdoasjsaodjoadjoasjdojasdojsaodijsaidojojsoidjasodij
      aoso
      """
    Then -> expect(@subject(@longString)).to.eq("\"#{@longString}\"")
