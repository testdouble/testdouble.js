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

## Stub with `when()`

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

## Verify with `verify()`

You can verify the behavior of methods with side-effects so long as you promise
to:
* Default to writing code that returns meaningful values and to asserting on those
* Never verify an invocation you've stubbed. If the stubbing is necessary for the
test to pass, then the verification is redundant.

That said, lots of code has side-effects, and to test-drive those interactions,
you can use the `verify` function.

First, create a test double:

```
var td = require('testdouble');
var myTestDouble = td.create();
```

Now, suppose you've passed this function into your [subject](https://github.com/testdouble/contributing-tests/wiki/Subject)
and you want to verify that it was called with the arguments `("foo", 5)`:

```
subject.callTheThingThatShouldBeInvokingMyTestDouble()

td.verify(myTestDouble("foo", 5))
```

Just invoke the method as you want to see it invoked inside a call to `verify()`.

If the verification succeeded, nothing will happen. If the verification fails,
you'll see an error like this one:

```
Unsatisfied test double verification.

  Wanted:
    - called with `("WOAH")`.

  But there were no invocations of the test double.
```

## Debug with `explain()`

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
```

If the test double does have stubbings or invocations, they'll be listed in the
description body for nicer error output.

## Configuration

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


# TODO: Matchers, Etc

The rest of the stuff we'd like to do with this is a work-in-progress. See the [issues](https://github.com/testdouble/testdouble.js/issues) for more detail on where we're headed.
