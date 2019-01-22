# testdouble.js (AKA td.js)

[![Build Status](https://circleci.com/gh/testdouble/testdouble.js/tree/master.svg?style=svg)](https://circleci.com/gh/testdouble/testdouble.js/tree/master)
[![npmjs](https://img.shields.io/badge/npm-testdouble-red.svg)](https://www.npmjs.com/package/testdouble)
[![unpkg](https://img.shields.io/badge/unpkg-download-blue.svg)](https://unpkg.com/testdouble/dist/)
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

(You may need to configure your linter to ignore the `td`  global.
Instructions:
[eslint](https://eslint.org/docs/user-guide/configuring#specifying-globals),
[standard](https://github.com/standard/standard/#i-use-a-library-that-pollutes-the-global-namespace-how-do-i-prevent-variable-is-not-defined-errors).)

If you're using testdouble.js in conjunction with another test framework, you
may also want to check out one of these extensions:

* [testdouble-jest](https://github.com/testdouble/testdouble-jest)
* [testdouble-chai](https://github.com/basecase/testdouble-chai)
* [testdouble-jasmine](https://github.com/BrianGenisio/testdouble-jasmine)
* [testdouble-qunit](https://github.com/alexlafroscia/testdouble-qunit/tree/master/packages/testdouble-qunit)

## Getting started

Mocking libraries are more often abused than used effectively, so figuring out
how to document a mocking library so as to only encourage healthy uses has
proven to be a real challenge. Here are a few paths we've prepared for getting
started with testdouble.js:

* The [API section of this README](#api) so you can get started stubbing and
  verifying right away
* A [20-minute
  video](http://blog.testdouble.com/posts/2016-06-05-happier-tdd-with-testdouble-js)
  overview of the library, its goals, and basic usage
* A [comparison between testdouble.js and
  Sinon.js](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html),
  in case you've already got experience working with Sinon and you're looking
  for a high-level overview of how they differ
* The full testdouble.js [documentation](/docs), which describes at length how
  to (and how not to) take advantage of the various features of testdouble.js.
  Its outline is in [docs/README.md](/docs#readme)

Of course, if you're unsure of how to approach writing an isolated test with
testdouble.js, we welcome you to [open an issue on GitHub to ask a
question](https://github.com/testdouble/testdouble.js/issues/new).

## API

### `td.replace()` for replacing dependencies

The first thing a test double library needs to do is give you a way to replace
the production dependencies of your [subject under
test](https://github.com/testdouble/contributing-tests/wiki/Subject) with fake
ones controlled by your test.

We provide a top-level function called `td.replace()` that operates in two
different modes: CommonJS module replacement and object-property replacement.
Both modes will, by default, perform a deep clone of the real dependency which
replaces all functions it encounters with fake test double functions which can,
in turn, be configured by your test to either stub responses or assert
invocations.

#### Module replacement with Node.js

**`td.replace('../path/to/module'[, customReplacement])`**

If you're using Node.js and don't mind using the CommonJS `require()` function
in your tests (you can still use `import`/`export` in your production code,
assuming you're compiling it down for consumption by your tests), testdouble.js
uses a library we wrote called [quibble](https://github.com/testdouble/quibble)
to monkey-patch `require()` so that your subject will automatically receive your
faked dependencies simply by requiring them. This approach may be familiar if you've used something like
[proxyquire](https://github.com/thlorenz/proxyquire), but our focus was to
enable an even more minimal test setup.

Here's an example of using `td.replace()` in a Node.js test's setup:

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
cache will be bypassed as `index` is loaded. If `index` goes on to subsequently
require any of the `td.replace()`'d dependencies, it will receive a reference to
the same fake dependencies that were returned to the test.

Because `td.replace()` first loads the actual file, it will do its best to
return a fake that is shaped just like the real thing. That means that if
`loads-purchases` exports a function, a test double function will be created and
returned. If `generates-invoice` exports a constructor, a constructor test
double will be returned, complete with test doubles for all of the original's
static functions and instance methods.  If `sends-invoice` exports a plain
object of function properties, an object will be returned with test double
functions in place of the originals' function properties. In every case, any
non-function properties will be deep-cloned.

There are a few important things to keep in mind about replacing Node.js modules
using `td.replace()`:

* The test must `td.replace()` and `require()` everything in a before-each hook,
  in order to bypass the Node.js module cache and to avoid pollution between
  tests
* Any relative paths passed to `td.replace()` are relative *from the test to the
  dependency*. This runs counter to how some other tools do it, but we feel it
  makes more sense
* The test suite (usually in a global after-each hook) must call `td.reset()` to
  ensure the real `require()` function and dependency modules are restored after
  each test case.

##### Default exports with ES modules

If your modules are written in the ES module syntax and they specify default
exports (e.g. `export default function loadsPurchases()`), just remember that
you'll need to reference `.default` when translating to the CJS module format.

That means instead of this:

```js
loadsPurchases = td.replace('../src/loads-purchases')
```

You probably want to assign the fake like this:

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

Remember to call `td.reset()` in an after-each hook (preferably globally so one
doesn't have to remember to do so in each and every test) so that testdouble.js
can replace the original. This is crucial to avoiding hard-to-debug test
pollution!

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

### `td.func()`, `td.object()`, `td.constructor()`, and `td.imitate()` to create test doubles

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
* **`td.func('some name')`** - returns a test double function named `'some
  name'`, which will appear in any error messages as well as the debug info
  returned by passing the returned test double into
  [td.explain()](/docs/9-debugging.md#tdexplainsometestdouble)
* **`td.func<Type>()`** - returns a test double function imitating the passed type. 
  Examples and more details can be found in [using with TypeScript](/docs/10-using-with-typescript.md)
  
#### `td.object()`

The `td.object()` function returns an object containing test double functions,
and supports three types of invocations:

* **`td.object(realObject)`** - returns a deep
  [imitation](https://github.com/testdouble/testdouble.js/blob/master/src/imitate/index.js)
  of the passed object, where each function is replaced with a test double function
  named for the property path (e.g. If `realObject.invoices.send()` was a
  function, the returned object would have property `invoices.send` set to a
  test double named `'.invoices.send'`)
* **`td.object(['add', 'subtract'])`** - returns a plain JavaScript object
  containing two properties `add` and `subtract` that are both assigned to test
  double functions named `'.add'` and `'.subtract'`, respectively
* **`td.object('a Person'[, {excludeMethods: ['then']})`** - when passed with no
  args or with a string name as the first argument, returns an [ES
  Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
  The proxy will automatically intercept any call made to it and shunt in a test
  double that can be used for stubbing or verification. More details can be
  found in [our full docs](/docs/4-creating-test-doubles.md#objectobjectname)
* **`td.object<Interface>()`** - returns an object with methods exposed as test doubles 
  that are typed according to the passed interface. Examples and more details can be found in 
  [using with TypeScript](/docs/10-using-with-typescript.md)
  
#### `td.constructor()`

If your code depends on ES classes or functions intended to be called with
`new`, then the `td.constructor()` function can replace those dependencies as
well.

* **`td.constructor(RealConstructor)`** - returns a constructor whose calls can
  be verified and whose static and `prototype` functions have all been replaced
  with test double functions using the same
  [imitation](https://github.com/testdouble/testdouble.js/blob/master/src/imitate/index.js)
  mechanism as `td.func(realFunction)` and `td.object(realObject)`
* **`td.constructor(['select', 'save'])`** - returns a constructor with `select`
  and `save` properties on its `prototype` object set to test double functions
  named `'#select'` and `'#save'`, respectively

When replacing a constructor, typically the test will configure stubbing &
verification by directly addressing its prototype functions. To illustrate, that
means in your test you might write:

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

#### `td.imitate()`

**`td.imitate(realThing[, name])`**

If you know you want to imitate something, but don't know (or care) whether it's
a function, object, or constructor, you can also just pass it to `td.imitate()`
with an optional name parameter.

### `td.when()` for stubbing responses

**`td.when(__rehearsal__[, options])`**

Once you have your subject's dependencies replaced with test double functions,
you'll want to be able to stub return values (and other sorts of responses)
when the subject invokes the test double in the way that the test expects.

To make stubbing configuration easy to read and grep, `td.when()`'s first
argument isn't an argument at all, but rather a placeholder to demonstrate the
way you're expecting the test double to be invoked by the subject, like so:

```js
const increment = td.func()
td.when(increment(5)).thenReturn(6)
```

We would say that `increment(5)` is "rehearsing the invocation". Note that by
default, a stubbing is only satisfied when the subject calls the test double
exactly as it was rehearsed. This can be customized with [argument
matchers](/docs/5-stubbing-results.md#loosening-stubbings-with-argument-matchers),
which allow for rehearsals that do things like
`increment(td.matchers.isA(Number))` or `save(td.matchers.contains({age: 21}))`.

Also note that, `td.when()` takes an [optional configuration
object](/docs/5-stubbing-results.md#configuring-stubbings) as a second
parameter, which enables advanced usage like ignoring extraneous arguments and
limiting the number of times a stubbing can be satisfied.

Calling `td.when()` returns a number of functions that allow you to specify your
desired outcome when the test double is invoked as demonstrated by your
rehearsal. We'll begin with the most common of these: `thenReturn`.

#### `td.when().thenReturn()`

**`td.when(__rehearsal__[, options]).thenReturn('some value'[, more, values])`**

The simplest example is when you want to return a specific value in exchange for
a known argument, like so:

```js
const loadsPurchases = td.replace('../src/loads-purchases')
td.when(loadsPurchases(2018, 8)).thenReturn(['a purchase', 'another'])
```

Then, in the hands of your subject under test:

```js
loadsPurchases(2018, 8) // returns `['a purchase', 'another']`
loadsPurchases(2018, 7) // returns undefined, since no stubbing was satisfied
```

If you're not used to stubbing, it may seem contrived to think a test will know
exactly what argument to pass in and expect back from a dependency, but in an
isolated unit test this is not only feasible but entirely normal and expected!
Doing so helps the author ensure the test remains minimal and obvious to
future readers.

Note as well that subsequent matching invocations can be stubbed by passing
additional arguments to `thenReturn()`, like this:

```js
const hitCounter = td.func()
td.when(hitCounter()).thenReturn(1, 2, 3, 4)

hitCounter() // 1
hitCounter() // 2
hitCounter() // 3
hitCounter() // 4
hitCounter() // 4
```

#### `td.when().thenResolve()` and `td.when().thenReject()`

**`td.when(__rehearsal__[, options]).thenResolve('some value'[, more, values])`**

**`td.when(__rehearsal__[, options]).thenReject('some value'[, more, values])`**

The `thenResolve()` and `thenReject()` stubbings will take whatever value is
passed to them and wrap it in an immediately resolved or rejected promise,
respectively. By default testdouble.js will use whatever `Promise` is globally
defined, but you can specify your own like this:

```js
td.config({promiseConstructor: require('bluebird')})`
```

Because the Promise spec indicates that all promises must tick the event loop,
keep in mind that any stubbing configured with `thenResolve` or `thenReject`
must be managed as an asynchronous test (consult your test framework's
documentation if you're not sure).

#### `td.when().thenCallback()`

**`td.when(__rehearsal__[, options]).thenCallback('some value'[,other,
args])`**

The `thenCallback()` stubbing will assume that the rehearsed invocation has an
additional final argument that takes a callback function. When this stubbing is
satisfied, testdouble.js will invoke that callback function and pass in whatever
arguments were sent to `thenCallback()`.

To illustrate, consider this stubbing:

```js
const readFile = td.replace('../src/read-file')
td.when(readFile('my-secret-doc.txt')).thenCallback(null, 'secrets!')
```

Then, the subject might invoke readFile and pass an anonymous function:

```js
readFile('my-secret-doc.txt', function (err, contents) {
  console.log(contents) // will print 'secrets!'
})
```

If the callback isn't in the final position, or if the test double also needs to
return something, callbacks can be configured using the
[td.callback](/docs/5-stubbing-results.md#callback-apis-with-a-callback-argument-at-an-arbitrary-position)
argument matcher.

On one hand, `thenCallback()` can be a great way to write fast and clear
synchronous isolated unit tests of production code that's actually asynchronous.
On the other hand, if it's necessary to verify the subject behaves correctly
over multiple ticks of the event loop, you can control this with the [`defer`
and `delay` options](/docs/5-stubbing-results.md#defer).

#### `td.when().thenThrow()`

**`td.when(__rehearsal__[, options]).thenThrow(new Error('boom'))`**

The `thenThrow()` function does exactly what it says on the tin. Once this
stubbing is configured, any matching invocations will throw the specified error.

Note that because rehearsal calls invoke the test double function, it's possible
to configure a `thenThrow` stubbing and then accidentally trigger it when you
attempt to configure subsequent stubbings or verifications. In these cases,
you'll need to work around it by re-ordering your configurations or `catch`'ing
the error.

#### `td.when().thenDo()`

**`td.when(__rehearsal__[, options]).thenDo(function (arg1, arg2) {})`**

For everything else, there is `thenDo()`. `thenDo` takes a function which will
be invoked whenever satisfied  with all the arguments and bound to the same
`this` context that the test double function was actually invoked with. Whatever
your `thenDo` function returns will be returned by the test double when the
stubbing is satisfied. This configuration is useful for covering tricky cases
not handled elsewhere, and may be a potential extension point for building on
top of the library's stubbing capabilities.

### `td.verify()` for verifying interactions

**`td.verify(__demonstration__[, options])`**

If you've learned how to stub responses with `td.when()` then you already know
how to verify an invocation took place with `td.verify()`! We've gone out of our
way to make the two as symmetrical as possible. You'll find that they have
matching function signatures, support the same argument matchers, and take the
same options.

The difference, then, is their purpose. While stubbings are meant to facilitate
some behavior we want to exercise in our subject, verifications are meant to
ensure a dependency was called in a particular expected way. Since `td.verify()`
is an assertion step, it goes [at the
end](https://github.com/testdouble/contributing-tests/wiki/Arrange-Act-Assert)
of our test after we've invoked the subject under test.

A trivial example might be:

```js
module.exports = function shouldSaveThings () {
  const save = td.replace('../src/save')
  const subject = require('../src/index')

  subject({name: 'dataz', data: '010101'})

  td.verify(save('dataz', '010101'))
}
```

The above will verify that `save` was called with the two specified arguments.
If the verification fails (say it passed `'010100'` instead), testdouble.js will
throw a nice long error message to explain how the test double function was
actually called, hopefully helping you spot the error.

Just like with `td.when()`, more complex cases can be covered with [argument
matchers](/docs/6-verifying-invocations.md#relaxing-verifications-with-argument-matchers)
and [configuration
options](/docs/6-verifying-invocations.md#configuring-verifications).

A word of caution: `td.verify()` should be needed only sparingly. When you
verify a function was called (as opposed to relying on what it returns) you're
asserting that your subject has a side effect. Code with lots of side effects is
bad, so mocking libraries are often abused to make side-effect heavy code easier
to proliferate. In these cases, refactoring each dependency to return values
instead is almost always the better design approach.  A separate test smell with
verifying calls is that sometimes—perhaps in the interest of maximal
completeness—a test will verify an invocation that already satisfied a stubbing,
but this is almost [provably
unnecessary](/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double).

### Other functions

For other top-level features in the testdouble.js API, consult the [docs](/docs)
directory:

* [td.explain()](/docs/9-debugging.md#tdexplainsometestdouble) - for help
  debugging and introspecting test doubles
* [td.config()](/docs/C-configuration.md#tdconfig) - for changing globally
  configurable options
* [td.reset()](/docs/1-installation.md#resetting-state-between-test-runs) - for
  resetting testdouble.js state between tests
* [td.matchers](/docs/5-stubbing-results.md#loosening-stubbings-with-argument-matchers)
  and [custom matchers](/docs/8-custom-matchers.md#custom-argument-matchers) for
  configuring more advanced stubbings and verifications


