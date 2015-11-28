# testdouble.js

[![Build Status](https://secure.travis-ci.org/testdouble/testdouble.js.svg)](http://travis-ci.org/testdouble/testdouble.js) [![npmjs](https://img.shields.io/badge/npm-testdouble-red.svg)](https://www.npmjs.com/package/testdouble)

Welcome! Are you writing JavaScript tests and in the market for a mocking library to
fake out real things for you? testdouble.js is an opinionated, carefully-designed
test double library maintained by, oddly enough, a software agency that's also
named [Test Double](http://testdouble.com).

If you practice test-driven development, testdouble.js was designed to promote
terse, clear, and easy-to-understand tests. There's an awful lot to cover, so
please take some time and enjoy our documentation, which itself is designed to
show you how to make the most out of test doubles in your tests.

## Docs

All of our docs are in the [docs/](docs/) directory inside this repository and
numbered for easy reading in the priority-order we anticipate people needing them.
Here's a rough outline:

1. [Installation](docs/1-installation.md#installing-testdoublejs)
  1. [for Node.js](docs/1-installation.md#for-use-in-nodejs-or-browserify)
  2. [for browsers](docs/1-installation.md#for-use-in-browsers)
  3. [initial configuration](docs/1-installation.md#configuring-testdoublejs-setting-up-in-your-test-suite)
2. [Purpose of testdouble.js](docs/2-howto-purpose.md#background)
  1. [in unit tests](docs/2-howto-purpose.md#test-doubles-and-unit-tests)
  2. [in integration tests](docs/2-howto-purpose.md#test-doubles-and-integration-tests)
3. [Getting started tutorial](docs/3-getting-started.md#getting-started)
4. [Creating test doubles](docs/4-creating-test-doubles.md#creating-test-doubles)
  1. [test double functions with `td.function()`](docs/4-creating-test-doubles.md#testdoublefunctionname)
  2. [test double objects with `td.object()`](docs/4-creating-test-doubles.md#testdoubleobject)
    1. [objects that mirror a constructor function](docs/4-creating-test-doubles.md#objectsomeconstructorfunction)
    2. [objects that mirror an object of functions](docs/4-creating-test-doubles.md#objectsomeobjectwithfunctions)
    3. [object of functions for an array of names](docs/4-creating-test-doubles.md#objectfunctionnames)
    4. [object of any functions using ES2015 Proxy](docs/4-creating-test-doubles.md#objectobjectname)
5. [Stubbing responses](docs/5-stubbing-results.md#stubbing-behavior)
  1. [td.when() API](docs/5-stubbing-results.md#testdoublewhen)
  2. [equality argument matching](docs/5-stubbing-results.md#simple-precise-argument-stubbing)
  3. [one-liner stubbings](docs/5-stubbing-results.md#one-liner-stubbings)
  4. [stubbing sequential return values](docs/5-stubbing-results.md#stubbing-sequential-return-values)
  5. [argument matchers](docs/5-stubbing-results.md#loosening-stubbings-with-argument-matchers)
    1. [td.matchers.anything()](docs/5-stubbing-results.md#testdoublematchersanything)
    2. [td.matchers.isA()](docs/5-stubbing-results.md#testdoublematchersisa)
    3. [td.matchers.contains()](docs/5-stubbing-results.md#testdoublematcherscontains)
      1. [matching strings](docs/5-stubbing-results.md#strings)
      2. [matching arrays](docs/5-stubbing-results.md#arrays)
      3. [matching objects](docs/5-stubbing-results.md#objects)
    4. [td.matchers.argThat()](docs/5-stubbing-results.md#testdoublematchersargthat)
  6. [Configuring stubbings](docs/5-stubbing-results.md#configuring-stubbings)
    1. [ignoreExtraArgs](docs/5-stubbing-results.md#ignoreextraargs)
    2. [times](docs/5-stubbing-results.md#times)
6. [Verifying invocations](docs/6-verifying-invocations.md#verifying-interactions)
  1. [td.verify() API](docs/6-verifying-invocations.md#testdoubleverify)
  2. [equality argument matching](docs/6-verifying-invocations.md#arguments)
  3. [argument matchers](docs/6-verifying-invocations.md#relaxing-verifications-with-argument-matchers)
    1. [td.matchers.anything()](docs/6-verifying-invocations.md#testdoublematchersanything)
    2. [td.matchers.isA()](docs/6-verifying-invocations.md#testdoublematchersisa)
    3. [td.matchers.contains()](docs/6-verifying-invocations.md#testdoublematcherscontains)
      1. [matching strings](docs/6-verifying-invocations.md#strings)
      2. [matching arrays](docs/6-verifying-invocations.md#arrays)
      3. [matching objects](docs/6-verifying-invocations.md#objects)
    4. [td.matchers.argThat()](docs/6-verifying-invocations.md#testdoublematchersargthat)
  4. [Argument captors](docs/6-verifying-invocations.md#multi-phase-assertions-with-argument-captors)
  5. [Configuring verifications](docs/6-verifying-invocations.md#configuring-verifications)
    1. [ignoreExtraArgs](docs/6-verifying-invocations.md#ignoreextraargs)
    2. [times](docs/6-verifying-invocations.md#times)
7. [Replacing dependencies with test doubles](docs/7-replacing-dependencies.md#replacing-dependencies-with-test-doubles)
  1. [for Node.js](docs/7-replacing-dependencies.md#nodejs)
    1. [td.replace() API](docs/7-replacing-dependencies.md#testdoublereplacerelativepath-faketoreplace)
      1. [Replacing plain functions](docs/7-replacing-dependencies.md#replacing-a-module-that-exports-a-plain-function)
      2. [Replacing plain objects](docs/7-replacing-dependencies.md#replacing-a-module-that-exports-a-plain-object)
      3. [Replacing a constructor function](docs/7-replacing-dependencies.md#replacing-a-module-that-exports-a-constructor-function)
      4. [Replacing a module that doesn't exist (yet)](docs/7-replacing-dependencies.md#replacing-a-module-that-doesnt-exist-yet)
  2. [for Browser JS](docs/7-replacing-dependencies.md#browser)
8. [Writing custom argument matchers](docs/8-custom-matchers.md#custom-argument-matchers)
9. [Debugging with testdouble.js](docs/9-debugging.md#debugging-with-testdoublejs)
  1. [td.explain() API](docs/9-debugging.md#testdoubleexplainsometestdouble)
10. [Plugins](docs/A-plugins.md#plugins)
  1. [testdouble-chai](https://github.com/basecase/testdouble-chai)
  2. [testdouble-jasmine](https://github.com/testdouble/testdouble.js/issues/41)
11. [Frequently Asked Questions](docs/B-frequently-asked-questions.md#frequently-asked-questions)
  1. [Why doesn't `td.replace()` work with external CommonJS modules?](docs/B-frequently-asked-questions.md#why-doesnt-tdreplace-work-with-external-commonjs-modules)

