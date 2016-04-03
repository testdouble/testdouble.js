return unless NODE_JS

describe "td.*", ->
  describe "where all the functions are", ->
    Then -> td.when == requireSource('when')
    Then -> td.verify == requireSource('verify')
    Then -> td.function == requireSource('function')
    Then -> td.func == requireSource('function')
    Then -> td.object == requireSource('object')
    Then -> td.matchers == requireSource('matchers')
    Then -> td.callback == requireSource('matchers/callback')
    Then -> td.explain == requireSource('explain')
    Then -> td.reset == requireSource('reset')
    Then -> td.replace == requireSource('replace/index')
    Then -> td.version == require('../../package').version
