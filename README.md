# testdouble.js

[![Build Status](https://travis-ci.org/testdouble/testdouble.js.svg?branch=master)](https://travis-ci.org/testdouble/testdouble.js)
[![npmjs](https://img.shields.io/badge/npm-testdouble-red.svg)](https://www.npmjs.com/package/testdouble)
[![Test Coverage](https://codeclimate.com/github/testdouble/testdouble.js/badges/coverage.svg)](https://codeclimate.com/github/testdouble/testdouble.js/coverage)

Welcome! Are you writing JavaScript tests and in the market for a mocking
library to fake out real things for you? testdouble.js is an opinionated,
carefully-designed test double library maintained by, oddly enough, a software
agency that's also named [Test Double](http://testdouble.com).

If you practice test-driven development, testdouble.js was designed to promote
terse, clear, and easy-to-understand tests. There's an awful lot to cover, so
please take some time and enjoy our documentation, which is designed to show you
how to make the most out of test doubles in your tests.

This library was designed to work for both Node.js and browser interpeters and
to be test-framework agnostic, so you can plop it into a codebase using Jasmine,
Mocha, Tape, Jest, or our own
[teenytest](https://github.com/testdouble/teenytest).

## Install

```js
npm install -D testdouble
```

If you just want to fetch the browser distribution, you can also get it from
[unpkg](https://unpkg.com/testdouble/dist/)

We recommend requiring the library in a test helper and setting it globally for
convenience to the shorthand `td`:

```js
global.td = require('testdouble') // Node.js; `window.td` for browsers
```

(You may need to declare the global in order to make your linter handy.
Instructions:
[eslint](https://eslint.org/docs/user-guide/configuring#specifying-globals),
[Standard](https://github.com/standard/standard/#i-use-a-library-that-pollutes-the-global-namespace-how-do-i-prevent-variable-is-not-defined-errors).)

## Getting started

Mocking libraries are more often abused than used effectively, so figuring out
how to document a mocking library that is designed to encourage only productive
use has been a real challenge. Here are a few paths to getting started:

* The [API section of this README](#api) to get an at-a-glance view of
  the API so you can get started stubbing and verifying right away
* A [20-minute
  video](http://blog.testdouble.com/posts/2016-06-05-happier-tdd-with-testdouble-js)
  overview of the library, its goals, and the basics of its API
* A [comparison between testdouble.js and
  Sinon.js](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html),
  in case you've already got experience working with Sinon and you're looking
  for a high-level overview of the differences
* The full testdouble.js [documentation](/docs), which is quite lengthy, but
  will do a thorough job to explain when to (and when not to) take advantage of
  the various faetures of testdouble.js. Its outline is at the [bottom of this
  README](#docs)

## API

### `td.replace()` for replacing dependencies

The first thing a test double library needs to do is give you a way to replace
the production dependencies of your [subject under
test](https://github.com/testdouble/contributing-tests/wiki/Subject) with fake
ones created by the library.

testdouble.js provides a top-level method called `td.replace()`

#### Module replacement with Node.js

If you're using Node.js and don't mind using the CommonJS `require` method in
your tests (you can still use `import`/`export` in your production code,
assuming you're compiling it down for consumption by your tests), testdouble.js
uses a library we wrote called [quibble](https://github.com/testdouble/quibble)
to monkey-patch the `require()` feature so that your subject will automatically
receive your faked dependencies simply by requiring them. (If you've used
something like [proxyquire](https://github.com/thlorenz/proxyquire), this is
like a slightly terser form of that)

Here's an example of using `td.replace` in the setup of a test of a Node.js
module:

```js
let loadsPurchases, generatesInvoice, sendsInvoice, subject
module.exports = {
  beforeEach: () => {
    loadsPurchases = td.replace('../src/loads-purchases')
    generatesInvoice = td.replace('../src/generates-invoice')
    sendsInvoice = td.replace('../src/sends-invoice')
    subject = require('../src/index')
  }
  //…
}
```

Things to remember about replacing Node.js modules:

* The test must `td.replace` and `require` everything in a before-each hook,
in order to bypass Node's module cache and avoid test pollution
* Relative paths to each replaced dependency are relative *from the test listing
  to the dependency*. This runs counter to how some other tools do it, but we
  feel it makes more sense
* The test suite (usually in a global after-each hook) must call `td.reset()` to
avoid test pollution

#### Property replacement

If you're running tests outside Node.js or otherwise injecting dependencies
manually (or with a DI tool like
[dependable](https://github.com/testdouble/dependable)), then you can still use
`td.replace` to automatically replace and imitate

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
2. [Purpose of testdouble.js](docs/2-howto-purpose.md#purpose)
   1. [in unit tests](docs/2-howto-purpose.md#test-doubles-and-unit-tests)
   2. [in integration tests](docs/2-howto-purpose.md#test-doubles-and-integration-tests)
3. [Getting started tutorial](docs/3-getting-started.md#getting-started)
4. [Creating test doubles](docs/4-creating-test-doubles.md#creating-test-doubles)
   1. [test double functions with `td.function()`](docs/4-creating-test-doubles.md#tdfunctionname)
   2. [test double objects with `td.object()`](docs/4-creating-test-doubles.md#tdobject)
   3. [test double constructors with `td.constructor()`](docs/4-creating-test-doubles.md#tdconstructor)
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
      3. [defer](docs/5-stubbing-results.md#defer)
      4. [delay](docs/5-stubbing-results.md#delay)
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
    1. [Why shouldn't I call both td.when and td.verify for a single interaction with a test double?](docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double)
12. [Configuration](docs/C-configuration.md#configuration)
    1. [td.config](docs/C-configuration.md#tdconfig)
