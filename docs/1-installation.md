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

**TODO: Test this**

While npm3 has in many ways obviated the need for Bower, it probably works too.
gl;hf, etc.

## Setting up in your test suite

testdouble.js is test framework-agnostic, meaning it'll work fine with qunit,
jasmine, mocha, or plain ol' assert. One thing is important, however, which is to
make sure testdouble.js is reset in-between tests with its `reset()` function.

For instance, mocha and jasmine expose an `afterEach` method. In a top-level
test helper, write:

```
afterEach(function(){
  td.reset()
})
```
