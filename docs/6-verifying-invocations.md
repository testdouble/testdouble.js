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

## td.verify()

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
  at Object.module.exports [as verify] (/Users/justin/code/testdouble/testdouble.js/lib/verify.js:22:15)
```

As you can see, the expected arguments of the failed verification are printed
along with any actual invocations of the test double function.

### Arguments

All of testdouble.js's [rules about argument precision when
stubbing](5-stubbing-results.md#simple-precise-argument-stubbing) apply here,
too. By default, each expected argument is tested against the arguments actually
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

Each of the [argument matchers supported when
stubbing](5-stubbing-results.md#what-are-argument-matchers) also work when
verifying an interaction. Below are simple examples of each built-in matcher

#### td.matchers.anything()

The `anything()` matcher will only ensure that an argument was passed, but will
ignore whatever its value was.

``` javascript
var bark = td.function()

bark('woof')

td.verify(bark('woof')) // passes
td.verify(bark(td.matchers.anything())) // passes
td.verify(bark(td.matchers.anything(), td.matchers.anything())) // throws - was 1 arg
td.verify(bark()) // throws - 1 arg needed
```

#### td.matchers.isA()

The `isA()` matcher can be used to verify a matching type for a given argument.

``` javascript
var eatBiscuit = td.function()

eatBiscuit(44)

td.verify(eatBiscuit(44)) // passes
td.verify(eatBiscuit(td.matchers.isA(Number))) // passes
td.verify(eatBiscuit(td.matchers.isA(Date))) // throws - 44 is not a Date
td.verify(eatBiscuit(td.matchers.isA(Object))) // throws - Number is not an Object
```

Unfortunately, the error message generated when a verification fails due to an
argument matcher mis-match is not very informative. If you'd like to help out,
see this issue to [improve the argument
matcher](https://github.com/testdouble/testdouble.js/issues/59) API.

#### td.matchers.contains()

The contains matcher is satisified if the passed-in portion of a string, array,
or object is found on an actual invocation of the test double.

##### Strings

``` javascript
var log = td.function()

log('Why hello there!')

td.verify(log('Why hello there!')) // passes
td.verify(log(td.matchers.contains('hello'))) // passes
td.verify(log(td.matchers.contains('goodbye'))) // throws - string not found
```

##### Arrays

``` javascript
var join = td.function()

join(['this','and','that'])

td.verify(join(['this','and','that'])) // passes
td.verify(join(td.matchers.contains('and'))) // passes
td.verify(join(td.matchers.contains('this','that'))) // passes
td.verify(join(td.matchers.contains('this','not that'))) // throws - 'not that' absent
```

##### Objects

``` javascript
var brew = td.function()

brew({ingredient: 'beans', temperature: 'cold'})

td.verify(brew({ingredient: 'beans', temperature: 'cold'})) // passes
td.verify(brew(td.matchers.contains({ingredient: 'beans'}))) // passes
td.verify(brew(td.matchers.contains({temperature: 'hot'}))) // throws - wa cold
```

And, just like when stubbing, `contains()` can be used to [match deeply-nested
object properties](5-stubbing-results.md#objects).

#### td.matchers.argThat()

When the argument match needed is more complex than can be described above, one
option is to pass a truth test to `argThat()`, like so:

``` javascript
var pet = td.function()

pet(['cat', 'dog'])

td.verify(pet(td.matchers.argThat(function(n){ return n.length > 1 }))) // passes
td.verify(pet(td.matchers.argThat(function(n){ return n.length > 2 }))) // throws
```

#### custom argument matchers

Remember that if none of the matchers above suit you, writing your own is as
easy as writing a function that returns an object with a `__matches` property.
Read the document on [custom matchers](8-custom-matchers.md) for more information.

### Multi-phase assertions with argument captors

Often in JavaScript, we'll pass an anonymous or privately-scoped function from
our subject under test to one of its dependencies. In order to fully test the
interaction between the subject and such a dependency, we need a way to get a
reference to that function.

One way to do this is to make the function publicly reachable and put it under
direct test. That has the benefit of being simple to read and explicit, but
often comes at the added cost of sacrificing the convenience of lexically-scoped
values and at the risk of cluttering an API with highly contextual one-off bits
of behavior.

Another way to accomplish the same thing is with what is called an "argument
captor". You can think of an argument captor as a special type of argument
matcher. To be more precise, an argument captor is an object that generates
an argument matcher which always reports a successful match, all-the-while
storing the value passed into said matcher for later access by the originating
test.

But, that sounds confusing! Let's see an example:

#### td.matchers.captor()

Let's say that we wrote a test for a function that looked like this:

``` javascript
function logInvalidComments(fetcher, logger) {
  fetcher('/comments', function(response){
    response.comments.forEach(function(comment) {
      if(!comment.valid) {
        logger('Hey, '+comment.text+' is invalid')
      }
    })
  })
}
```

JavaScript has a knack for enabling very dense functions—the above makes an HTTP
request, handles the response, and for each invalid `comment` resource, writes
out a particular logger statement. So, how do we verify that the `logger()`
function is being invoked exactly as we specified?

You could use an argument captor to write a sort of two-staged test for both the
top-level function along with its embedded anonymous function.

The test begins similarly to what we've seen before, with a verification of the
top-most depended-on function, `fetcher`:

``` javascript
var logger = td.function('logger'),
    fetcher = td.function('fetcher'),
    captor = td.matchers.captor()

logInvalidComments(fetcher, logger)

td.verify(fetcher('/comments', captor.capture()))
```

The only novel thing seen above is the invocation of `captor()` to create a new
argument captor object and its use in the `verify()` demonstration call to
`fetcher` with `captor.capture()`. Remember, we're said to be "capturing" the
value of that second argument because there's no other way for our test to get
a reference to that function without changing the production source code.

Now that we've captured a reference to the anonymous callback function, we can
put it under test, too. Once `capture()` is called, the `captor` object will
retain the captured argument on a property named `value`:

``` javascript
var response = {comments: [{valid: true}, {valid: false, text: 'PANTS'}]}

captor.value(response)

td.verify(logger('Hey, PANTS is invalid'))
```

This style is definitely verbose, but it's very explicit and entirely
synchronous. Rather than write asynchronous unit tests of asynchronous code,
this pattern enables developers to maintain control over how their code executes
by testing it synchronously. The benefits to this are comprehensability of what
the test does at runtime, easier debugging, and no reliance on a test framework
to provide async support.

Is writing tests in this style worth it? A better question might be, "is there
an easier-to-use design conducive to an outside-in TDD workflow?" Without casting
judgment on passing around anonymous functions per se, I've found that they're
typically best used in two places, neither of whose tests do I use test doubles:

* Calls to asynchronous I/O - one reason for needing to pass a function is to
defer some bit of evaluation until an I/O operation has completed. I do my best
to draw my I/O interactions near enough to the entry point such that my "domain
logic" is relatively unconcerned with it. If I succeed at making the entry point
mostly branchless and imperative, I'll test it only via an integration test and
not concern myself with trying to unit test it with test doubles
* Transforming data - the other major use for passing around
anonymous functions is when using a library like [lodash](http://lodash.com) to
translate some initial value using operations like
[map](https://lodash.com/docs#map), [reduce](https://lodash.com/docs#reduce),
[zip](https://lodash.com/docs#zip), and [groupBy](https://lodash.com/docs#groupBy).
I tend not to use test doubles in tests of functions that do much of this either,
because they can usually be expressed or composed into pure functions that can
be tested perfectly well without any dependencies to be isolated from.

It's due to the reasoning above that one should question the frequent use of
argument captors or the perceived need for asynchronous behavior in unit tests.
For related conversation, check out Gary Bernhardt's excellent talk on this topic
called [Boundaries](https://www.destroyallsoftware.com/talks/boundaries).

#### Capturing multiple invocations with td.matchers.captor()

In some cases you may want to capture multiple invocations of the same function or
method in one test. A common usecase for this is subscription based APIs where a
callback will be invoked for each message. To handle this usecase, `captors` expose
a `values` array which will hold each argument passed during every invocation of the
callback:

``` javascript
var captor = td.matchers.captor(),
    responseCallback = td.function();

subscribe('/chat', responseCallback); // subscribe() will call responseCallback twice
td.verify(responseCallback('/chat', captor.capture()))

assert.equal(captor.values[0], 'first message');
assert.equal(captor.values[1], 'second message');
````

### Configuring verifications

Verifications can be configured in [the exact same ways that stubbings
can](5-stubbing-results.md#configuring-stubbings). By passing an options object
as the second argument to `verify()`, you can modify the behavior of an assertion.
For added clarity, below are some example uses to demonstrate their behavior.

#### ignoreExtraArgs

When you don't care about any of the args passed to a function, or only the first
n arguments passed, you can use the `ignoreExtraArgs: true` option:

``` javascript
var print = td.function()

print('some', 'stuff', 'out', 'like', 8)

td.verify(print()) // throws, missng all arguments
td.verify(print(), {ignoreExtraArgs: true}) // passes
td.verify(print('some'), {ignoreExtraArgs: true}) // passes
td.verify(print('some', 'stuff'), {ignoreExtraArgs: true}) // passes
td.verify(print('some', 'stuff', 'NOPE'), {ignoreExtraArgs: true}) // throws, wrong arg
```

If you'd like to improve the error message when `ignoreExtraArgs` is used,
consider contributing a pull request for [this
issue](https://github.com/testdouble/testdouble.js/issues/60).

#### times

Sometimes, we want to verify that a test double was called an exact number of
times in a certain way. With the `times` option we can do that.

``` javascript
var save = td.function()

save('thing')
save('thing')

td.verify(save('thing')) // passes
td.verify(save('thing'), {times: 1}) // throws - was called twice
```

##### Never, ever call something

As a silly example to combine both options so far, consider this test to ensure
that a function was never called, regardless of arguments:

``` javascript
var doNotCall = td.function()

td.verify(doNotCall(), {times: 0, ignoreExtraArgs: true}) // passes
```

## Congratulations!

And that's everything there is to know about verifying behavior with
testdouble.js! At this point, you know everything you need to know to be pretty
dangerous writing isolated tests.
