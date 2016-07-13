# testdouble.js

[![Build Status](https://secure.travis-ci.org/testdouble/testdouble.js.svg)](http://travis-ci.org/testdouble/testdouble.js) [![npmjs](https://img.shields.io/badge/npm-testdouble-red.svg)](https://www.npmjs.com/package/testdouble)
[![Test Coverage](https://codeclimate.com/github/testdouble/testdouble.js/badges/coverage.svg)](https://codeclimate.com/github/testdouble/testdouble.js/coverage)

Welcome! Are you writing JavaScript tests and in the market for a mocking library to
fake out real things for you? testdouble.js is an opinionated, carefully-designed
test double library maintained by, oddly enough, a software agency that's also
named [Test Double](http://testdouble.com).

If you practice test-driven development, testdouble.js was designed to promote
terse, clear, and easy-to-understand tests. There's an awful lot to cover, so
please take some time and enjoy our documentation, which itself is designed to
show you how to make the most out of test doubles in your tests.

## The pitch

Interested in learning what testdouble.js is, why it exists, and what the API
offers? The quickest path is this fast-paced 20-minute talk:

[<img width="633" alt="screenshot of testdouble.js talk" src="https://cloud.githubusercontent.com/assets/79303/16356401/1a9d7ffc-3aa4-11e6-833f-9d6094547297.png">
](https://vimeo.com/169413322)

## Coming from Sinon.js?

Right now, Sinon.js is the test double incumbent in JavaScript, with over 1.7
million downloads in the last month. If you've got experience with Sinon, [check
out our side-by-side
comparison](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html)
to see why we wrote testdouble.js and how some of the API translates.

## The Very Basics

Before diving into our in-depth docs, here is a quick intro of the basic uses:

### Stubbing return values for functions

```js
var td = require('testdouble');

var fetch = td.function();
td.when(fetch(42)).thenReturn('Jane User');

fetch(42); // -> 'Jane User'
```

### Verifying a function was invoked

```js
var td = require('testdouble');

var save = td.function('.save');
save(41, 'Jane');

td.verify(save(41, 'Jill'));
//
// Error: Unsatisfied verification on test double `.save`.
//
//   Wanted:
//     - called with `(41, "Jill")`.
//
//   But was actually called:
//     - called with `(41, "Jane")`.
```

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
  1. [test double functions with `td.function()`](docs/4-creating-test-doubles.md#tdfunctionname)
  2. [test double objects with `td.object()`](docs/4-creating-test-doubles.md#tdobject)
    1. [objects that mirror a constructor function](docs/4-creating-test-doubles.md#objectsomeconstructorfunction)
    2. [objects that mirror an object of functions](docs/4-creating-test-doubles.md#objectsomeobjectwithfunctions)
    3. [object of functions for an array of names](docs/4-creating-test-doubles.md#objectfunctionnames)
    4. [object of any functions using ES2015 Proxy](docs/4-creating-test-doubles.md#objectobjectname)
5. [Stubbing responses](docs/5-stubbing-results.md#stubbing-behavior)
  1. [td.when() API](docs/5-stubbing-results.md#tdwhen)
  2. [equality argument matching](docs/5-stubbing-results.md#simple-precise-argument-stubbing)
  3. [one-liner stubbings](docs/5-stubbing-results.md#one-liner-stubbings)
  4. [stubbing sequential return values](docs/5-stubbing-results.md#stubbing-sequential-return-values)
  5. [argument matchers](docs/5-stubbing-results.md#loosening-stubbings-with-argument-matchers)
    1. [td.matchers.anything()](docs/5-stubbing-results.md#tdmatchersanything)
    2. [td.matchers.isA()](docs/5-stubbing-results.md#tdmatchersisa)
    3. [td.matchers.contains()](docs/5-stubbing-results.md#tdmatcherscontains)
      1. [matching strings](docs/5-stubbing-results.md#strings)
      2. [matching arrays](docs/5-stubbing-results.md#arrays)
      3. [matching objects](docs/5-stubbing-results.md#objects)
    4. [td.matchers.argThat()](docs/5-stubbing-results.md#tdmatchersargthat)
    5. [td.matchers.not()](docs/5-stubbing-results.md#tdmatchersnot)
  6. [Stubbing callback APIs](docs/5-stubbing-results.md#stubbing-callback-apis)
  7. [Stub exceptions with thenThrow](docs/5-stubbing-results.md#stub-exceptions-with-thenthrow)
  8. [Stub promises with thenResolve and thenReject](docs/5-stubbing-results.md#stub-promises-with-thenresolve-and-thenreject)
  9. [Stub side effects with thenDo](docs/5-stubbing-results.md#stub-side-effects-with-thendo)
  10. [Configuring stubbings](docs/5-stubbing-results.md#configuring-stubbings)
    1. [ignoreExtraArgs](docs/5-stubbing-results.md#ignoreextraargs)
    2. [times](docs/5-stubbing-results.md#times)
6. [Verifying invocations](docs/6-verifying-invocations.md#verifying-interactions)
  1. [td.verify() API](docs/6-verifying-invocations.md#tdverify)
  2. [equality argument matching](docs/6-verifying-invocations.md#arguments)
  3. [argument matchers](docs/6-verifying-invocations.md#relaxing-verifications-with-argument-matchers)
    1. [td.matchers.anything()](docs/6-verifying-invocations.md#tdmatchersanything)
    2. [td.matchers.isA()](docs/6-verifying-invocations.md#tdmatchersisa)
    3. [td.matchers.contains()](docs/6-verifying-invocations.md#tdmatcherscontains)
      1. [matching strings](docs/6-verifying-invocations.md#strings)
      2. [matching arrays](docs/6-verifying-invocations.md#arrays)
      3. [matching objects](docs/6-verifying-invocations.md#objects)
    4. [td.matchers.argThat()](docs/6-verifying-invocations.md#tdmatchersargthat)
  4. [Argument captors](docs/6-verifying-invocations.md#multi-phase-assertions-with-argument-captors)
  5. [Configuring verifications](docs/6-verifying-invocations.md#configuring-verifications)
    1. [ignoreExtraArgs](docs/6-verifying-invocations.md#ignoreextraargs)
    2. [times](docs/6-verifying-invocations.md#times)
7. [Replacing dependencies with test doubles](docs/7-replacing-dependencies.md#replacing-real-dependencies-with-test-doubles)
  1. [for Node.js](docs/7-replacing-dependencies.md#nodejs)
  2. [for Browser JS](docs/7-replacing-dependencies.md#browser)
  3. [td.replace() API](docs/7-replacing-dependencies.md#testdoublereplace-api)
8. [Writing custom argument matchers](docs/8-custom-matchers.md#custom-argument-matchers)
9. [Debugging with testdouble.js](docs/9-debugging.md#debugging-with-testdoublejs)
  1. [td.explain() API](docs/9-debugging.md#tdexplainsometestdouble)
10. [Plugins](docs/A-plugins.md#plugins)
  1. [testdouble-chai](https://github.com/basecase/testdouble-chai)
  2. [testdouble-jasmine](https://github.com/BrianGenisio/testdouble-jasmine)
11. [Frequently Asked Questions](docs/B-frequently-asked-questions.md#frequently-asked-questions)
  1. [Why doesn't `td.replace()` work with external CommonJS modules?](docs/B-frequently-asked-questions.md#why-doesnt-tdreplace-work-with-external-commonjs-modules)
12. [Configuration](docs/C-configuration.md)
  1. [td.config](docs/C-configuration.md#tdconfig)
