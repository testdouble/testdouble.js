# Installing testdouble.js

## Downloading testdouble.js

### For use in Node.js (or Browserify)

To install and use in Node.js, simply install testdouble from npm:

```
$ npm install --save-dev testdouble
```

For ease-of-use, we recommend setting test double as a global throughout your
test suite and to name that global something brief. We've been accustomed to
using `td`, so in a test helper loaded before your tests:

```
global.td = require('testdouble')
```

All examples in these documents will assume `testdouble` is available as `td`.

### For use in Browsers

The most recent release (not master itself) is always available on the master
branch of the git repo, to make it easier to fetch the browser distribution of
testdouble.js

#### curl

The easiest way to fetch testdouble is to curl it:

```
$ curl https://raw.githubusercontent.com/testdouble/testdouble.js/master/dist/testdouble.js -o test/helpers/testdouble.js
```

And then just check it into source control. It may be old-fashioned, but it
still works.

#### npm

You can also install testdouble from npm and then copy, move, symlink, or point
your front-end build tool at it:

```
$ npm install --save-dev testdouble
```

And then find the browser distribution of the library in
`node_modules/testdouble/dist/testdouble.js`.

#### bower

To install testdouble.js with bower:

```
$ bower install --save-dev testdouble/testdouble.js
```

Once installed, the browser library can be found in `bower_components/testdouble/dist/testdouble.js`

## Configuring testdouble.js Setting up in your test suite

testdouble.js is a standalone library. It can be used with any test library,
such as [QUnit](http://qunitjs.com), [Mocha](https://mochajs.org),
[Jasmine](http://jasmine.github.io), or any other. In fact, you can use it
without any test library at all.

### Naming test double

In browsers, testdouble.js will be set as a global variable at `window.testdouble`.
In Node.js, the library is available via `require('testdouble')` like any other
module.

However, because the risk of global variables wreaking havoc on the universe is
less extraordinary for test-scoped code, and because typing `testdouble` or
`require('testdouble')` thousands of times in a test suite seems like a bummer,
we typically will alias the library a test helper to
`window.td = window.testdouble` for browsers or
`global.td = require('testdouble')` for Node.js.

You're welcome to address testdouble or any of its functions however you prefer,
but all of this documentation will assume that you've aliased it to `td` for the
sake of terseness.

### Resetting state between test runs

The only configuration you'll want to make sure you set up is to reset the state of
testdouble.js between tests, because it stores the state of all your test double
functions globally. If you don't reset, you run the risk of succumbing to subtle
test pollution and/or accidental order dependencies between tests.

For instance, Mocha and Jasmine both expose an `afterEach` method. In a top-level
test helper, you could write:

``` javascript
afterEach(function(){
  td.reset()
})
```

In QUnit, you should be able to reset testdouble.js using the `QUnit.testDone`
hook.

``` javascript
QUnit.testDone(function() {
  td.reset()
})
```
