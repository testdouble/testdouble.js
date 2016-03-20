return unless NODE_JS


describe 'stringify/anything', ->
  Given -> @subject = requireSource('stringify/anything')
  Then -> @subject(undefined) == "undefined"
  And -> @subject(null) == "null"
  And -> @subject(0) == "0"
  And -> @subject("foo") == '"foo"'
  And -> @subject(false) == 'false'

  context 'short strings of objects should be one-lined', ->
    Then -> expect(@subject({userId: 42, name: 'Jane'})).to.eq('{userId: 42, name: "Jane"}')

  context 'long strings of objects should be multi-lined', ->
    Given -> @object =
      userId: 42,
      name: 'Jane'
      details:
        kids: ['jack', 'jill']

    Given -> @object.circular = @object

    Then -> expect(@subject(@object)).to.eq """
      {
        userId: 42,
        name: "Jane",
        details: {kids: ["jack", "jill"]},
        circular: "[Circular]"
      }
    """

  context 'short strings should have quotes escaped', ->
    Given -> @shortString = 'hey "justin"!'
    Then -> expect(@subject(@shortString)).to.eq('"hey \\\"justin\\\"!"')

  context 'multiline strings should be heredoc-d', ->
    Given -> @longString = """
      ojsaodjasiodjsaodijsado asj asodjaosdj asodjsaoidjsa odjasoidjasodjas
      asdojsadojdosajodsajd saoji joasdjoajsd
      asdjoj

      asdojasdoajsdoasjdaosjdoasjsaodjoadjoasjdojasdojsaodijsaidojojsoidjasodij
      aoso
      """
    Then -> expect(@subject(@longString)).to.eq("\"\"\"\n#{@longString}\n\"\"\"")
