describe "testdouble.js", ->
  Given -> @subject = requireSubject('lib/testdouble')
  describe "where all the functions are", ->
    Then -> @subject.when == requireSubject('lib/when')
    Then -> @subject.verify == requireSubject('lib/verify')
    Then -> @subject.create == requireSubject('lib/create')
    Then -> @subject.matchers == requireSubject('lib/matchers')
    Then -> @subject.explain == requireSubject('lib/explain')
