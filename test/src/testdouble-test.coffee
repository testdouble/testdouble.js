describe "td.*", ->
  describe "where all the functions are", ->
    Then -> td.when == require('../../src/when').default
    Then -> td.verify == require('../../src/verify').default
    Then -> td.function == require('../../src/function').default
    Then -> td.func == require('../../src/function').default
    Then -> td.object == require('../../src/object').default
    Then -> td.constructor == require('../../src/constructor').default
    Then -> td.matchers == require('../../src/matchers').default
    Then -> td.callback == require('../../src/callback').default
    Then -> td.explain == require('../../src/explain').default
    Then -> td.reset == require('../../src/reset').default
    Then -> td.replace == require('../../src/replace').default
    Then -> td.version == require('../../package').version
