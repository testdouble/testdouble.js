# Plugins

Because testdouble.js, even as a focused test double API, is quite large, we
encourage users in the community to consider implementing features as plugins
that decorate additional functionality on and around testdouble.js.

If you have an idea for a feature you'd like to see, please [open an
issue](https://github.com/testdouble/testdouble.js/issues/new) to start a
discussion on the best place for that feature to live (in the core library or
as a plugin).

## Assertion Plugins

As discussed elsewhere, testdouble.js is written to be test-library-agnostic. In
order to use the library in your test suite, you don't need a custom plugin for
your preferred testing framework. However, it may be the case that you'd prefer
to bridge the `verify()` method of testdouble.js with your preferred assertion
API for aesthetic or error-handling reasons.

Thes plugins developed by the community:

* [testdouble-chai](https://github.com/basecase/testdouble-chai) - Chai assertions
* [testdouble-jasmine](https://github.com/testdouble/testdouble.js/issues/41) -
Jasmine `expect` matchers (WIP by @BrianGenisio)

## Build Plugins

Sometimes, it can be handy to have a ready-made shim to pull in and configure the 
library for various build tools. Here's what testdouble.js has so far:

* [ember-cli-testdouble](https://github.com/isleofcode/ember-cli-testdouble) by 
[@AlexBlom](https://github.com/AlexBlom) provides a shim for easy importing of 
testdouble.js by Ember projects that using Ember CLI
* [karma-testdouble](https://github.com/kahwee/karma-testdouble) by 
[@kahwee](https://github.com/kahwee) will configure 
[Karma](https://karma-runner.github.io) to load test double's browser
distribution

## Fake Timers

One popular feature of Sinon.js is its [fake timer
API](http://sinonjs.org/docs/#clock), which can be used to synchronously test
code that should defer execution for a certain amount of time (for instance, when
testing that a component debounces user input).

This API has been ported for use with testdouble.js by
[@kuy](https://github.com/kuy) as
[testdouble-timers](https://github.com/kuy/testdouble-timers).
