# Plugins

As discussed elsewhere, testdouble.js is written to be test-library-agnostic. In
order to use the library in your test suite, you don't need a custom plugin for
your preferred testing framework. However, it may be the case that you'd prefer
to bridge the `verify()` method of testdouble.js with your preferred assertion
API for aesthetic or error-handling reasons.

Plugins developed by the community:

* [testdouble-chai](https://github.com/basecase/testdouble-chai) - Chai assertions
* [testdouble-jasmine](https://github.com/testdouble/testdouble.js/issues/41) -
Jasmine `expect` matchers (WIP by @BrianGenisio)

If you're interested in developing a testdouble.js plugin, we'd love if you
[opened an issue](https://github.com/testdouble/testdouble.js/issues/new) to
discuss your idea with us.
