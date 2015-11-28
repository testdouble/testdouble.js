# Purpose

## Background

Why did the world need another JavaScript mocking library? Because "mocks" (more
broadly, they're called "test doubles") are poorly understood and commonly
misused. To make matters worse, most test double libraries available for
JavaScript are too unopinionated, are missing important features, and have
frustratingly awkward APIs.

Maybe it's because we chose to name our company
[Test Double](http://testdouble.com), but the current state of affairs was
disconcerting enough that we decided to throw our hat into the ring with a
laser-focused, opinionated library that could be used for specifying the
collaboration between our functions & objects in a clear and consistent way.

## When should I use it?

Oversimplifying a bit, there are two types of test suites in this world: (1) unit
tests used to specify the individual functions & objects that make up a broader
whole, and (2) integrated tests used to ensure that an entire application,
library, service, or repository works as intended.

### Test Doubles and unit tests

Test Doubles are intended to be used in conjunction with unit tests, but their
utility will vary dramatically based on the design of the code being tested.

There are three types of functions you might put under test, each with a very
different recommended approach to using test doubles:

1. Functions which, based on arguments or state, return some kind of useful value.
(e.g. `add(5, 3)` returning `8`, or `getFullName()` concatenating `this.firstName`
and `this.lastName`). These functions have **no need for test doubles**, because
a test can set up the state or provide the necessary arguments and then verify
the returned result without a need for fake objects & functions

2. Functions which don't do any heavy-lifting themselves, but rather depend on
other functions and invoke them as necessary to either return a value or trigger
a side effect. Specifying these sort of "collaborators" types are **why test doubles
exist**, as those depended-on functions can be replaced with test doubles and
configured to stub responses or used to verify interactions

3. Functions which combine the previous two types, featuring both testworthy logic
as well as interactions with dependencies. These functions and their tests
usually represent a mixed level of abstraction, leading to overly complex tests.
They may be necessary from time-to-time, but should be
minimized, because **although test doubles may still be useful** for these sort of
functions, they will often **confuse the story of the logic that the function
performs**. If a function outsources, say, three of its four responsibilities,
it's usually better off outsourcing the fourth to a dependency as well so it can
be cleanly described and tested as a collaborator function, as described above

So, to recap, Test Doubles aren't appropriate for use when testing the first
group of functions, can be fantastic design sounding boards for the second group
of functions, and the third group of functions encourage frustrating tests
whether or not test doubles are used. In practice, test doubles best fill a very
narrow niche within any given application's overall test portfolio. (Which may
explain why they're so often misunderstood.)

Alas, out in the wild, most people use test doubles as painkillers. Too much of
the code written today is made up of dense, complex functions that fall into the
third category described above. Testing (and TDD) represent a fantastic
opportunity to experience and remediate awkwardness in our APIs and in the
contracts between the objects we create. That's why it's so unfortunate that
most test doubles are used to snuff out pain caused by hard-to-test code.
Ironically, test double libraries were invented as a means to expose problematic
code design, but are much more often used to make hard-to-use code easier to
test.

The purpose of testdouble.js and its documentation is to promote productive use
of test doubles, especially in isolated TDD workflows. As a result, this
document will aim to do more than explain features and configuration, it will
also discourage common antipatterns, warn when a feature should only be used
sparingly, and point out when common features were intentionally omitted.

### Test Doubles and integration tests

We recommend against using testdouble.js or any test double library in
integrated test suites.

For integrated tests, test doubles are typically too specific a tool. When
writing an integrated test, it's important to ensure the whole thing is working
under somewhat realistic conditions. Because test doubles are by their nature
fake functions & objects that need to be handed to or injected into the universe
of the thing under test, their use runs the risk of sacrificing the veracity of
the thing being tested. Additionally, using test doubles will typically increase
the coupling between the test and the implementation of the system under test,
which isn't desirable as it hinders refactor safety and can lead to [false
negative test
failures](http://github.com/testdouble/contributing-tests/wiki/Test-Failure-Analysis).

Due to these risks, when writing integrated tests it's usually preferable to only
fake things that are outside the purview of the system under test. For instance, if
your application makes network requests which you want to control, a fake server
that can be configured to stub HTTP responses and verify HTTP requests (e.g.
[covet](https://github.com/testdouble/covet)) will increase confidence that the
test verifies what it says it does. The same goes for virtually any integration,
whether it's a database, key-value store, job queue, e-mail, SMS service, or 3rd
party API.

Nevertheless, people often choose to use test doubles in integration tests for
their speed and convenience anyway. While testdouble.js can be used for this
purpose, it wasn't designed with it in mind and won't accept features focused on
supporting integrated tests.

If you go down this route, we strongly urge you to wrap 3rd-party dependencies
in adapter functions to fake those adapters instead of the 3rd-party API—this
will decrease the degree to which test doubles will leak throughout the
integrated test suite and afford some opportunity for responding to hard-to-test
situations by improving the API design of your adapters.
