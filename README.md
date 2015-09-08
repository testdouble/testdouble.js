# testdouble.js

[![Build Status](https://secure.travis-ci.org/testdouble/testdouble.js.png)](http://travis-ci.org/testdouble/testdouble.js)

The goal of this project is to provide a test-framework-agnostic test double library for JavaScript which mirrors [Mockito](http://mockito.org) pretty closely. That means each Test Double created by the library will be a spy that is also capable of stubbing values. Other conveniences (like matchers, ordered invocation & verification, etc.) will be added, but only to the extent they benefit an isolated TDD workflow.

If you need a robust test double library that's designed to cover every possible use case, we recommend checking out [Sinon.JS](http://sinonjs.org).

## Install

```
npm install testdouble --save-dev
```

At the moment, the library is only published to npm as a normal CommonJS module.
If you'd like to use this for browser tests, please use Browserify or consider
sending a pull request for [this issue](https://github.com/testdouble/testdouble.js/issues/10)

### Configuration

The library is not coupled to any test framework, which means it can be used with
jasmine, QUnit, Mocha, or anything else. However, to get the most out of the library,
you may choose to make a few of the top-level functions global in a test helper
(to cut down on repetitive typing).

Perhaps you want to keep everything namespaced under `td` for short:

```
global.td = require('testdouble');
```

Or, you might prefer to plop the methods directly on the global:

```
global.double = require('testdouble').create;
global.when = require('testdouble').when;
global.verify = require('testdouble').verify;
```

Organize it however you like, being mindful that sprinkling in globals might save
on per-test setup cost, but at the expense of increased indirection for folks
unfamiliar with the test suite's setup.

## Stubbing

To stub with testdouble.js, first require it:

```
var td = require('testdouble');
```

Create a test double with the `create` function:

```
myTestDouble = td.create();
```

You can stub a no-arg invocation like so:

```
td.when(myTestDouble()).thenReturn("HEY");

myTestDouble(); // returns "HEY"
```

You can stub a specific set of args (performs lodash's `_.isEqual` on each) with:

```
td.when(myTestDouble('a', 5, {foo: 'bar'})).thenReturn("YES");

myTestDouble('a', 5, {foo: 'bar'}); // returns "YES"

myTestDouble('a', 5, {foo: 'baz'}); // returns undefined
```

## Explain

One shortcoming of lots of JavaScript test double libraries is pretty rotten
introspection and output. While this library is generally pretty minimal, some
data about your test doubles can be gleaned by passing them to a top-level
`explain` function, like so:

``` javascript
var td = require('testdouble');
var myTestDouble = td.create();

td.explain(myTestDouble); /*
  Returns:
  {
    callCount: 0,
    calls: [],
    description: 'This test double has 0 stubbings and 0 invocations.'
  }
*/

If the test double does have stubbings or invocations, they'll be listed in the
description body for nicer error output.

# TODO: Verifying, Matchers, Etc

The rest of the stuff we'd like to do with this is a work-in-progress. See the [issues](https://github.com/testdouble/testdouble.js/issues) for more detail on where we're headed.
