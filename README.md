# testdouble.js

[![Build Status](https://secure.travis-ci.org/testdouble/testdouble.js.png)](http://travis-ci.org/testdouble/testdouble.js)

The goal of this project is to provide a test-framework-agnostic test double library for JavaScript which mirrors [Mockito](http://mockito.org) pretty closely. That means each Test Double created by the library will be a spy that is also capable of stubbing values. Other conveniences (like matchers, ordered invocation & verification, etc.) will be added, but only to the extent they benefit an isolated TDD workflow.

If you need a robust test double library that's designed to cover every possible use case, we recommend checking out [Sinon.JS](http://sinonjs.org).

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

# TODO: Verifying, Matchers, Etc

The rest of the stuff we'd like to do with this is a work-in-progress. See the [issues](https://github.com/testdouble/testdouble.js/issues) for more detail on where we're headed.
