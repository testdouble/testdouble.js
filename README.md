# testdouble.js

[![Build Status](https://secure.travis-ci.org/testdouble/testdouble.js.png)](http://travis-ci.org/testdouble/testdouble.js)

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

