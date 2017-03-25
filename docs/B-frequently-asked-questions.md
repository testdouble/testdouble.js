# Frequently Asked Questions

Whenever someone asks a particularly salient question about testdouble.js, we'll
log it here for the benefit of anyone reading up on how to make the most use of
the library.

## Why shouldn't I call both td.when and td.verify for a single interaction with a test double?

It's a common mistake to call `td.verify` for an invocation that's already been
stubbed with `td.when`. Some users might feel like this is appropriate,
motivated by a desire to be sure that the test double was invoked as expected,
but if the stubbing was necessary to exercise the desired behavior in the
subject, then adding an additional verification is redundant.

For example, given this function:

``` js
function getName(load, id) {
  return load(id).name
}
```

And this test:

``` js
var load = td.function()
td.when(load(42)).thenReturn({name: "Jane"})

var result = getName(load, 42)

assert(result, "Jane")
td.verify(load(42))
```

The assertion that `result` is `"Jane"` is sufficient to specify the behavior
of the function. The additional `td.verify` call is redundant, because if `load`
had not been invoked with `42`, then there's no way that `getName` could have
returned `"Jane"`, since the stubbing wouldn't have been satisfied. Worse, it
further couples the test to the subject's implementation—if, hypothetically, the
`getName` function were able to determine the correct return value without
calling `load`, the test would start failing even though there would
be nothing wrong with the implementation.

As a result, testdouble.js will print a console warning when it detects that
a stubbed invocation is also being verified.
