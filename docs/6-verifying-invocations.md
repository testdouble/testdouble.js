# Verifying interactions

If you haven't read through the document on [stubbing](5-stubbing-results.md), be
sure to read it first. Why?

First, because the API for verifying invocations of
test double functions is essentially identical to the API for stubbing responses,
so if you're familiar with how to stub using testdouble.js, there isn't much
more to know about verifying interactions.

Second, verifying that a method was invoked is only necessary when a depended-on
function is being invoked for its side effect (as opposed to returning a
meaningful value). For starters, pure functions that return useful values without
a side effect are much easier to understand, test, and maintain, so we'd be
better off writing more of them—that means it'd be a bit worrisome to see a
test suite with lots of test double verification calls.

One last word of warning, never verify an invocation that was also stubbed. If
the stubbing is necessary for the test to pass, then adding a verification for
the same invocation is redundant and unnecessary. This is a counter-intuitive
point for a lot of people, so we'll just leave it at, "only verify an invocation
when there's no other way to assert that your subject is doing what you want it
to do."

OK, disclaimers aside, lots of functions have side effects by design, and
testdouble.js provides a `verify()` function for asserting that an invocation
happened exactly as you expected it. Here's how to use it.

The examples in this document assume you've aliased `testdouble` to `td`.

## testdouble.verify()

A basic verification looks like this:

``` javascript
var quack = td.function('quack')

quack('QUACK')

td.verify(quack('QUACK')) // Nothing happens, because verification was satisfied
```

As you can see, `td.verify` is very similar to `td.when`, in that it ignores the
first argument passed to it so that in our test we can write a "demonstration"
of how we expected the test double to have been invoked by our code under test.

When a verification fails, an error is thrown with a message like the following:

``` javascript
td.verify(quack())
Error: Unsatisfied verification on test double `quack`.

  Wanted:
    - called with `()`.

  But was actually called:
    - called with `("QUACK")`.
  at Object.module.exports [as verify] (/Users/justin/code/testdouble/testdouble.js/generated/verify.js:22:15)
```

As you can see, the expected arguments of the failed verification are pritned
along with any actual invocations of the test double function.

### Arguments

All of the rules about argument precision when stubbing apply here, too. By
default, each expected argument is tested against the arguments actually
passed to the test double with lodash's [_.isEqual](http://lodash.com/docs#isEqual)
function.

``` javascript
var enroll = td.function()

enroll({name: 'Joe', age: 22, gender: null})

td.verify(enroll({name: 'Joe', age: 22, gender: null})) // passes — deeply equal
td.verify(enroll({name: 'Joe', age: 22})) // throws - missing property
td.verify(enroll({name: 'Joe', age: 23, gender: null})) // throws - not equal
```

### Relaxing verifications with argument matchers

Each of the

------
First, create a test double:

``` javascript
var td = require('testdouble');
var myTestDouble = td.function();
```

Now, suppose you've passed this function into your [subject](https://github.com/testdouble/contributing-tests/wiki/Subject)
and you want to verify that it was called with the arguments `("foo", 5)`:

``` javascript
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

### Using Argument Captors

An argument captor is a object that provides a function called "capture", which
itself is a special type of an argument matcher, which "captures" an
actual value that's passed into a test double by your subject code, such that
your test can access that value. Typically, a test would want to use a captor
when complex assertion logic is necessary or when an anonymous function is
passed into a test double and that function should be put under test directly.

**Beware before using:** if your test double is receiving an argument that can't
be verified with the default equality check or a more straightforward matcher,
ask yourself if the contract between the subject and the test double is as simple
as it should be before trying to salve the "gee, this is hard to test" pain by
using a captor. In my practice, I typically only use captors when I'm testing
legacy code or when exposing an anonymous function via a public API would be
undesirable. **/BEWARE**

Here's an example. Suppose you want to write a test that would specify this bit
of code:

```
function logInvalidComments(fetcher, logger) {
  fetcher('/comments', function(response){
    response.comments.forEach(function(comment) {
      if(!comment.valid) {
        logger('Hey, '+comment.text+' is invalid');
      }
    });
  });
}
```

You could use an argument captor to write a sort of two-staged test for both the
top-level function along with its embedded anonymous function.

```
//Stage 1: Test the outer function
var td = require('testdouble'),
    assert = require('assert'),
    logger = td.function('logger'),
    fetcher = td.function('fetcher'),
    captor = td.matchers.captor();

logInvalidComments(fetcher, logger);

td.verify(fetcher('/comments', captor.capture()));

// Stage 2: Now we test the anonymous function passed to `fetcher`
var response = {comments: [{valid: true}, {valid: false, text: 'PANTS'}]};

captor.value(response);

assert.ok(td.explain(logger).callCount === 1);
td.verify(logger('Hey, PANTS is invalid'));
```

This style is definitely verbose, but it's very explicit and entirely
synchronous. Rather than write asynchronous unit tests of asynchronous code,
this pattern enables developers to maintain control over how their code executes
by testing it synchronously. The benefits to this are comprehensability of what
the test does at runtime, easier debugging, and no reliance on a test framework
to provide async support.


