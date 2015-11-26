
## Verify with `verify()`

You can verify the behavior of methods with side-effects so long as you promise
to:
* Default to writing code that returns meaningful values and to asserting on those
* Never verify an invocation you've stubbed. If the stubbing is necessary for the
test to pass, then the verification is redundant.

That said, lots of code has side-effects, and to test-drive those interactions,
you can use the `verify` function.

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


