# TODO: this whole test is a joke, because when @jasonkarns unified the test
# helpers it just became an identity check, since requireSubject will just
# traverse the dot properties of subject. Should definitely replace this with
# a node-only test
describe "testdouble.js", ->
  Given -> @subject = requireSubject()
  describe "where all the functions are", ->
    Then -> @subject.when == requireSubject('lib/when')
    Then -> @subject.verify == requireSubject('lib/verify')
    Then -> @subject.function == requireSubject('lib/function')
    Then -> @subject.object == requireSubject('lib/object')
    Then -> @subject.matchers == requireSubject('lib/matchers')
    Then -> @subject.explain == requireSubject('lib/explain')
    Then -> @subject.reset == requireSubject('lib/reset')
    Then -> @subject.replace == requireSubject('lib/replace')
    Then -> !!@subject.version.match(/\d+\.\d+\.\d+/)
