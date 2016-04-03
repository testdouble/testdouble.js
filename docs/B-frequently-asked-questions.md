# Frequently Asked Questions

Whenever someone asks a particularly salient question about testdouble.js, we'll
log it here for the benefit of anyone reading up on how to make the most use of
the library.

## Why doesn't `td.replace()` work with external CommonJS modules?

[Jörn Zaefferer asked](https://github.com/testdouble/testdouble.js/issues/51)
whether testdouble.js would support replacing third-party CommonJS modules in
Node.js with the [td.replace()](7-replacing-dependencies.md) feature.

The short answer is "no, testdouble.js does not plan to support this".

The longer answer is that when we practice TDD with test doubles, we "don't mock
what we don't own". The reason for using mocks in our practice is to improve the
richness of design feedback by making awkward interactions with dependencies
painful; the appropriate response to that pain is to make that dependency's API
better.

With that being the purpose of using test doubles, replacing a third-party API
will often just lead to *useless pain*, because the author isn't in an immediate
position to improve the third party API.

Rather, our use of 3rd party dependencies (insofar as how our unit tests interact
with them) typically break down into two categories:

* Utility functions (e.g. `lodash`) — we call through to the real utility
function from our unit test so long as they don't add additional side effects or
break the purity of the function; I use these much more in unit tests of pure
functions, which themselves typically don't require any dependencies (and
therefore test doubles) at all
* Integration functions (e.g. `request`) — we create adapters/wrappers of these
dependencies that delegate to the third-party functions and then we replace those
adapters/wrappers in our tests. That way, any custom branching, configuration,
or API de-awkward-ification we apply to that dependency is in the wrapper and
effectively centralized in a single place in the app. Not only is this a great
way to prevent a third party module from seeping throughout the codebase, but it
can provide a template for how to later replace that area of functionality with
a different 3rd party dependency. It can even be a good first step towards
introducing an adapter pattern to deal with an option of multiple 3rd party
dependencies.

As a result, we aren't planning to go out of our way to support replacing modules
with quibble / td.js

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
