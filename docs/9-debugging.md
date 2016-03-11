# Debugging with testdouble.js

One weakness of many test double libraries is a lack of introspection capabilities.
Reading some bit of code you might find a test double and ask "what stubbings
have been set up on this double?" or "how many times has this been invoked?". Or,
perhaps the semantics of using `td.verify()` don't fit the flow of a complex test
assertion very well, and you'd rather dig into the history of calls made against
a test double and assert whether it was interated with manually.

Fortunately, testdouble.js was designed with this in mind. In addition to
encouraging every test double object & function to have a name (so you can figure
which one is causing you grief easily), the error messages the library produces
are on the verbose side. When those aren't enough, there is a method named
`explain()` which takes a test double function as an argument and will describe
the current configuration and state of the test double.

The examples in this document assume you've aliased `testdouble` to `td`.

## td.explain(someTestDouble)


``` javascript
var myTestDouble = td.function()

td.explain(myTestDouble) /*
  {
    callCount: 0,
    calls: [],
    description: 'This test double has 0 stubbings and 0 invocations.'
  }
*/
```

If the test double does have stubbings or invocations, they'll be listed in the
description body as well. For instance, suppose you set up a stubbing on the
test double:

``` javascript
td.when(myTestDouble(5)).thenReturn(10)

td.explain(myTestDouble) /*
  {
    callCount: 0,
    calls: [],
    description: 'This test double has 1 stubbings and 0 invocations.

      Stubbings:
      - when called with `(5)`, then return `10`.'
  }
*/

```

Explain will also summarize any calls made to the test double. Let's say we
call the test double function but fail to satisfy the stubbing we just
configured:

``` javascript
myTestDouble(7) // undefined

td.explain(myTestDouble) /*
  {
    callCount: 1,
    calls: [ { args: [7], context: window } ],
    description: 'This test double has 1 stubbings and 1 invocations.
      Stubbings:
      - when called with `(5)`, then return `10`.

      Invocations:
      - called with `(7)`.'
  }
*/
```

If you'd like to make `explain()` even better, consider sending a pull request
to make [`explain` describe test double objects](https://github.com/testdouble/testdouble.js/issues/48)
in addition to functions.


