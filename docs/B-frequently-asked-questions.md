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
