describe "testdouble.js", ->
  Given -> @subject = requireSubject()
  describe "where all the functions are", ->
    Then -> @subject.when == requireSubject('lib/when')
    Then -> @subject.verify == requireSubject('lib/verify')
    Then -> @subject.function == requireSubject('lib/function')
    Then -> @subject.object == requireSubject('lib/object')
    Then -> @subject.matchers == requireSubject('lib/matchers')
    Then -> @subject.explain == requireSubject('lib/explain')
    # This test is a farse because requireSubject no longer calls require
    # Then -> @subject.reset == requireSubject('lib/store').reset
    Then -> !!@subject.version.match(/\d+\.\d+\.\d+/)
