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

When we publish new versions of testdouble.js, we also generate a browser build
of the library that's ready to be used in browsers, which you'll find in
"dist/testdouble.js" of the installed package. This distribution will also
define a `td` global variable, so you can use the library without necessitating
any kind of module system in your test build.

#### via npm

Most people manage their front-end dependencies these days with `npm`, so most
commonly we'd expect people to pull down testdouble.js by installing it with npm
and pointing whatever front-end build tool they use to it.

```
$ npm install --save-dev testdouble
```

And then find the browser distribution of the library in
`node_modules/testdouble/dist/testdouble.js`.

#### via unpkg

You can also just fetch the latest (or any) version of the library from
the unpkg CDN. You can even curl it:

```
$ curl -L https://unpkg.com/testdouble/dist/testdouble.js
```

And then just check it into source control. It may be old-fashioned, but it
still works.

## Configuring testdouble.js Setting up in your test suite

testdouble.js is a standalone library. It can be used with any test library,
such as [QUnit](http://qunitjs.com), [Mocha](https://mochajs.org),
[Jasmine](http://jasmine.github.io), or any other. In fact, you can use it
without any test library at all.

### Naming testdouble.js

Our browser distribution sets the library on a global variable named `window.td`.
In Node.js, the library is loaded via `require('testdouble')`, as you might
expect (though we recommend assigning it to `global.td` in a test helper, for
terseness sake).

You're welcome to address testdouble.js or any of its functions however you prefer,
but all of this documentation will assume that it's available globally as `td`.

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

***
Next:  [Purpose](2-howto-purpose.md#purpose)
