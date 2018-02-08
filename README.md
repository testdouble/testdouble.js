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

This library was designed to work for both Node.js and browser interpeters. It's
also test-framework agnostic, so you can plop it into a codebase using Jasmine,
Mocha, Tape, Jest, or our own
[teenytest](https://github.com/testdouble/teenytest).

## Install

```
$ npm install -D testdouble
```

If you just want to fetch the browser distribution, you can also curl it from
[unpkg](https://unpkg.com/testdouble/dist/).

We recommend requiring the library in a test helper and setting it globally for
convenience to the shorthand `td`:

```js
global.td = require('testdouble') // Node.js; `window.td` for browsers
```

(You may need to declare the global in order to make your linter handy.
Instructions:
[eslint](https://eslint.org/docs/user-guide/configuring#specifying-globals),
[standard](https://github.com/standard/standard/#i-use-a-library-that-pollutes-the-global-namespace-how-do-i-prevent-variable-is-not-defined-errors).)

## Getting started

Mocking libraries are more often abused than used effectively, so figuring out
how to document a mocking library in such a way as to only encourage healthy
use has proven to be a real challenge. Here are a few paths to getting started:

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

Of course, if you're unsure of how to approach writing an isolated test with
testdouble.js, we welcome you to [open a issue on GitHub to ask a
question](https://github.com/testdouble/testdouble.js/issues/new).

## API

### `td.replace()` for replacing dependencies

The first thing a test double library needs to do is give you a way to replace
the production dependencies of your [subject under
test](https://github.com/testdouble/contributing-tests/wiki/Subject) with fake
ones created by the library.

We provide a top-level method called `td.replace()` that operates in two
different modes: CommonJS module replacement and object-property replacement.
Both modes will, by default, perform a deep clone the real dependency but
replace all of its functions with fake test double functions that you can
configure and observe.

#### Module replacement with Node.js

**`td.replace('../path/to/module'[, customReplacement])`**

If you're using Node.js and don't mind using the CommonJS `require` method in
your tests (you can still use `import`/`export` in your production code,
assuming you're compiling it down for consumption by your tests), testdouble.js
uses a library we wrote called [quibble](https://github.com/testdouble/quibble)
to monkey-patch the `require()` feature so that your subject will automatically
receive your faked dependencies simply by requiring them. (If you've used
something like [proxyquire](https://github.com/thlorenz/proxyquire), this is
like a slightly terser form of that.)

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
  afterEach: function () { td.reset() }
}
```

In the above example, at the point when `src/index` is required, the module
cache will be bypassed, and if `index` goes on to subsequently require any of
the `td.replace()`'d dependencies, it will receive a reference to the same fake
dependency returned to the test. If `loads-purchases` exports a function, a test
double function will be created to imitate it. If `generates-invoice` exports a
constructor, the constructor and all of its instance methods will also be
imitated. If `sends-invoice` exports a plain object of function properties, each
function will be replaced with a test double (and the other values cloned).

To repeat, important things to remember about replacing Node.js modules:

* The test must `td.replace` and `require` everything in a before-each hook,
in order to bypass Node's module cache and avoid test pollution
* Relative paths to each replaced dependency are relative *from the test listing
  to the dependency*. This runs counter to how some other tools do it, but we
  feel it makes more sense
* The test suite (usually in a global after-each hook) must call `td.reset()` to
avoid test pollution

##### Default exports with ES modules

If your modules are written in the ES module syntax and they specify default
exports, just remember that you'll need to reference `.default` when translating
to CJS syntax.

That means instead of this:

```js
loadsPurchases = td.replace('../src/loads-purchases')
```

You probable mean to assign the fake like this:

```js
loadsPurchases = td.replace('../src/loads-purchases').default
```

#### Property replacement

**`td.replace(containingObject, nameOfPropertyToReplace[, customReplacement])`**

If you're running tests outside Node.js or otherwise injecting dependencies
manually (or with a DI tool like
[dependable](https://github.com/testdouble/dependable)), then you may still use
`td.replace` to automatically replace things if they're referenceable as
properties on an object.

To illustrate, suppose our subject depends on `app.signup` below:

``` js
app.signup = {
  onSubmit: function () {},
  onCancel: function () {}
}
```

If our goal is to replace `app.signup` during a test of `app.user.create()`,
our test setup might look like this:

```js
let signup, subject
module.exports = {
  beforeEach: function () {
    signup = td.replace(app, 'signup')
    subject = app.user
  }
  // …
  afterEach: function () { td.reset() }
}
```

`td.replace()` will always return the newly-created fake imitation, even though
in this case it's obviously still referenceable by the test and subject alike
with `app.signup`. If we had wanted to only replace the `onCancel` function for
whatever reason (though in this case, that would smell like a [partial
mock](https://github.com/testdouble/contributing-tests/wiki/Partial-Mock)), we
could have called `td.replace(app.signup, 'onCancel')`, instead.

Remember, calling `td.reset()` in an after-each hook (preferably globally so one
doesn't have to remember to do so in each-and-every test) so that testdouble.js
can replace the original is crucial to avoiding hard-to-debug test pollution!

#### Specifying a custom replacement

The library's [imitation
feature](https://github.com/testdouble/testdouble.js/blob/master/src/imitate/index.js)
is pretty sophisticated, but it's not perfect. It's also going to be pretty slow
on large, complex objects. If you'd like to specify exactly what to replace a
real dependency with, you can do so in either of the above modes by providing a
final optional argument.

When replacing a Node.js module:

```js
generatesInvoice = td.replace('../generates-invoice', {
  generate: td.func('a generate function'),
  name: 'fake invoices'
})
```

When replacing a property:

```js
signup = td.replace(app, 'signup', {
  onSubmit: td.func('fake submit handler'),
  onCancel: function () { throw Error('do not call me') }
})
```

### `td.func()`, `td.object()`, and `td.constructor()` to create test doubles

`td.replace()`'s imitation and injection convenience is great when your
project's build configuration allows for it, but in many cases you'll want or
need the control to create fake things directly. Each creation function can
either imitate a real thing or be specified by passing a bit of configuration.

Each test double creation function is very flexible and can take a variety of
inputs. What gets returned generally depends on the number and type of configuration
parameters passed in, so we'll highlight each supported usage separately with an
example invocation:

#### `td.func()`

The `td.func()` function (also available as `td.function()`) returns a test
double function and can be called in three modes:

* **`td.func(someRealFunction)`** - returns a test double function of the same
  `name`, including a deep
  [imitation](https://github.com/testdouble/testdouble.js/blob/master/src/imitate/index.js)
  of all of its custom properties
* **`td.func()`** - returns an anonymous test double function that can be used
  for stubbing and verifying any calls against it, but whose error messages and
  debugging output won't have a name to trace back to it
* **`td.func('some name')** - returns a test double function named 'some name',
  which will appear in any error messages as well as the debug info returned by
  passing the returned test double into `td.explain()`

#### `td.object()`

The `td.object()` function returns an object containing test double functions,
and supports three types of invocations:

* **`td.object(realObject)`** - returns a deep
  [imitation](https://github.com/testdouble/testdouble.js/blob/master/src/imitate/index.js)
  the passed object, where each function is replaced with a test double function
  named for the property path (e.g. If `realObject.invoices.send()` was a
  function, the returned object would have a test double named
  `'.invoices.send'`)
* **`td.object(['add', 'subtract'])`** - returns a plain JavaScript object
  containing two properties `add` and `subtract` that are both assigned to test
  double functions named `'.add'` and `'.subtract'`, respectively.
* **`td.object(['a Person', {excludeMethods: ['then']})`** - when passed with no
  args or with a string as the first argument, returns an [ES
  Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
  The proxy will automatically intercept any call made to it and shunt in a test
  double that can be used for stubbing or verification. More details can be
  found in [our full docs](/docs/4-creating-test-doubles.md#objectobjectname)

#### `td.constructor()`

If your code depends on ES classes or functions intended to be called with
`new`, then the `td.constructor()` function can replace those dependencies as
well.

* **`td.constructor(RealConstructor)`** - returns a constructor whose calls can
  be verified and whose `prototype` functions have all been replaced with test
  double functions using the same
  [imitation](https://github.com/testdouble/testdouble.js/blob/master/src/imitate/index.js)
* **`td.constructor(['select', 'save'])`** - returns a constructor with `select`
  and `save` properties set to test double functions named `'#select'` and
  `'#save'` on its `prototype` object

When replacing a constructor, typically the test will configure stubbing &
verification by directly addressing its prototype functions.

To illustrate, That means in your test you might write:

```js
const FakeConstructor = td.constructor(RealConstructor)
td.when(FakeConstructor.prototype.doStuff()).thenReturn('ok')
subject(FakeConstructor)
```

So that in your production code you can:

```js
const subject = function (SomeConstructor) {
  const thing = new SomeConstructor()
  return thing.doStuff() // returns "ok"
}
```

---
# old docs:
---

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

