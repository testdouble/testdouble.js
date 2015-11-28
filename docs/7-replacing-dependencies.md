# Replacing Dependencies with Test Doubles

All of these test doubles aren't of much value if your subject can't reference
them. Because CommonJS module-loading with `require` is the dominant way to
organize and load code across file listings, testdouble.js provides a special
mechanism for replacing particular file paths with test doubles in as unobtrusive
a way as possible.

This document assumes `testdouble` is aliased to `td`.

## Node.js

> **Note:** this feature will not work on Node.js 0.10 or earlier, meaning it
requires Node.js 0.11 or later (or any iojs release).

To make it as easy and clear as possible to replace a subject's real dependencies
with test doubles, testdouble.js provides an intelligent `replace()` function,
powered by a module named [quibble](https://github.com/testdouble/quibble). By
calling `td.replace('../some/path/to/a/dependency')`, any subsequent calls to
`require` for paths that resolve to the same absolute path will be intercepted
and replaced with a test double function or object by mirroring whatever the
actual dependency exports when `require`'d.

It sounds a little like magic, so let's look at a simple example. Suppose we
write a simple test in `test/lib/car-test.js`:

``` javascript
var brake = td.replace('./../../lib/brake'),
    subject = require('./../../lib/car')

subject.slowDown()

td.verify(brake(10))
```

In order to make the above test pass, we first need to create `lib/brake.js` and
export a function, so that testdouble.js knows to replace `require` calls with
a test double function (as opposed to an empty `module.exports` object):

``` javascript
module.exports = function(){}
```

Once the dependency is prototyped, we can implement `lib/car.js` in such a way
as to make our little test pass:

``` javascript
var brake = require('./brake')

module.exports.slowDown = function(){
  brake(10)
}
```

The API above is unusual enough that we recommend you poke around at [the more
involved example project](../examples/node/test/lib/car-test.js) provided into
the testdouble.js repository. For a more formal discussion of the `replace()`
API, read on.

### testdouble.replace(relativePath, [fakeToReplace])

Pass `replace()` a relative path string as if the test was calling `require` for

the dependency to be replaced with a test double. Calling `replace` will:

1. Resolve the provided relative path to an absolute one
2. Call `require` on the path to see whether its module exports a plain function,
a plain object containing function properties, or a constructor function (as
determined by having functions on the `prototype` object)
3. Create a test double function, object, or artificial constructor whose
functions have been replaced by test doubles, respectively
4. Wrap the Node.js built-in `Module._load` function and intercept any calls made
to the dependency by the subject, instead returning the test double
5. Return the test double created in step 3 so the test has access to it

It is **very important** when using this feature that [`td.reset()` is invoked
after each test](1-installation.md#resetting-state-between-test-runs), or else
bizarre and terrible things will happen.

#### replacing a module that exports a plain function

Let's say your subject is `lib/basket.js` and it depends on `lib/banana.js` and
your test is in a `test/lib` directory. If `banana.js` exported:

``` javascript
module.exports = function(){}
```

Then a test of `basket.js` would be able to use `td.replace()` to create and
inject a test double function named "lib/banana.js"

``` javascript
var banana = td.replace('../banana'),
    subject = require('../basket')

td.when(banana()).thenReturn('peel') // where banana is a test double function
```

And if `basket.js` calls `require('./banana')`, it will receive the same `banana`
function returned to the test.

#### replacing a module that exports a plain object

Given our subject is still `lib/basket.js` and it depends on `lib/fruits.js` and
your test is in a `test/lib` directory. If `fruits.js` exported:

``` javascript
module.exports.cherry = function(){}
module.exports.lime = function(){}
module.exports.lemon = function(){}
```

Then a test of `basket.js` would be able to use `td.replace()` to create and
inject an object of test double functions with names like "lib/fruits.js.lime"

``` javascript
var fruits = td.replace('../fruits'),
    subject = require('../basket')

td.when(fruits.lime()).thenReturn('juice') // where fruits.lime is a test double function
```

And if `basket.js` calls `require('./fruits')`, it will receive the same `fruits`
object returned to the test.

#### replacing a module that exports a constructor function

Sticking with our subject `lib/basket.js`, say it depends on `lib/juicer.js` and
your test is still in a `test/lib` directory. If `juicer.js` exported:

``` javascript
module.exports = function Juicer(){}
module.exports.prototype.juice = function(){}
```

Then a test of `basket.js` would be able to use `td.replace()` to create and
inject a wrapped constructor function imitating `Juicer`.

``` javascript
var juicer = td.replace('../juicer'),
    subject = require('../basket')

subject()

td.verify(juicer.juice()) // where juicer.juice is a test double function
```

There's a subtle asymmetry in this case, however, because it's not enough to
inject an _instance_ of the `Juicer` function type, the subject needs to be able
to instantiate `Juicer` with `new` itself. The test doesn't have any particular
need to call `new Juicer()`, however, so it's returned a plain object containing
the test double functions.

That means that `lib/basket.js` would be able to:

``` javascript
var Juicer = require('./juicer')

module.exports = function(){
  new Juicer().juice() // to access the test double function, we must `new Juicer()`
}
```

#### replacing a module that doesn't exist yet

We discussed the merits of creating entirely test-scoped test doubles vs. those
that mirror their actual counterparts in the [chapter on creating test
doubles](4-creating-test-doubles.md#testdoubleobject). So, say you want to
replace `require` calls to a module that doesn't actually exist yet.
`td.replace()` supports this with an optional second argument.

``` javsacript
thisWillEqual42 = td.replace('../some-made-up-path', 42)
```

Once set, if the subject is in a sibling directory then calling
`require('./some-made-up-path')` will return `42`. Of course, although that
replacement value can be literally anything, it will often be a `td.function()`
or `td.object()`.

#### Aside: third-party modules

If you're curious why testdouble.js doesn't support replacing third-party
modules, you can see our commentary on why we "[don't mock what we don't
own](B-frequently-asked-questions.md#why-doesnt-tdreplace-work-with-external-commonjs-modules)".

## Browser

Given the eclectic array of browser namespacing, module loading, and packaging
schemes (not to mention the limited runtime introspection available in ES
`import`), testdouble.js doesn't yet try to solve the problem of injecting or
otherwise replacing test doubles to replace a subject's actual dependencies.

For now, each browser project will need to come up with its own dependency
replacement scheme. One tried-and-true approach is to pass dependencies into a
subject so they're explicit and can be overridden easily.

Another approach one could take (in apps that use a global namespace to organize
code) is to replace stuff on that namespace and unwind it in an `afterEach`. On
a jasmine or mocha project, that could be as simple as a helper like this
(untested) example:

``` javascript
function replace(namespace, object, someTestDouble) {
  var originalThing = namespace[object]
  namespace[object] = someTestDouble
  afterEach(function(){
    namespace[object] = originalThing
  })
}
```

That said, we'd really like to [implement this
scheme](https://github.com/testdouble/testdouble.js/issues/55) to make it easier
to get started with the library out of the box. It'd be great to see someone
[create a plugin](A-plugins.md) to support popular module loading schemes.



