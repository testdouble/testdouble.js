# Getting Started

Let's kick things off with an example, shall we?

## The problem

Suppose we're tasked with writing a function that generates random arithmetic
problems. We spend a few minutes debating the requirements, and we agree that
the problems should be random, persisted, and then HTTP POST'ed to an
educational app, presumably for some aspiring math student to solve.

This is a trivial example, and could be implemented in one dense function, but
instead, we'll use it to illustrate one workflow that leverages test doubles to
design our code from the outside-in by breaking the problem down into its
component parts.

Thinking for a moment, we decide the top-level function ought to have three
dependencies:

1. Something that generates two random integers and a random arithmetic operator
2. Something that persists the arithmetic problem and returns a persisted problem,
replete with an as-yet-undetermined identifier property
3. Something that sends the problem in an HTTP POST request to the remote
educational app server.

The implementation details of those three dependencies will be fascinating, for
sure, but better left to worry about once we've successfully implemented the
top-level function that coordinates their interaction. Once that test is done
and passing, we can recurse into any of those three dependencies with a renewed
sense of focus, only worrying about solving one thing at a time, be it random
number generation, persistence, or making a network request.

Outside-in TDD's primary benefit is focus—both in the sense of increased
productivity as well as in producing small, focused units of code with very
narrow sets of responsibility.

Okay, that was a lot of planning. Let's start a test.

## Writing the test

Because we're going to tackle this problem with outside-in test-driven
development, let's start with a test of our top-level function,
`MathProblem#generate`. We'll be using a jasmine/mocha compatible DSL for these
examples. (You can find a project with this test in this repo in
examples/getting-started.)

Let's start with an empty test:

``` javascript
describe('MathProblem', function(){
  it('POSTs a random problem', function(){
  })
})
```

Next, let's create our subject & invoke the method:

``` javascript
describe('MathProblem', function(){
  var subject;
  before(function(){
    subject = new MathProblem()
  })
  it('POSTs a random problem', function(){
    subject.generate()
  }) // Red -- ReferenceError: MathProblem is not defined
})
```

Make it green by defining the constructor & function:

``` javascript
MathProblem = function(){}

MathProblem.prototype.generate = function() {} // Green
```

### Creating a test double

Recalling our gameplan, let's start by defining our first test double and
providing it to the subject. In this case, we'll just imagine a single function
to do the job:

``` javascript
describe('MathProblem', function(){
  var subject, createRandomProblem;
  beforeEach(function(){
    createRandomProblem = td.function('createRandomProblem')
    subject = new MathProblem(createRandomProblem)
  })
  it('POSTs a random problem', function(){
    subject.generate()
  })
})
```

In the above, we use `td.function([name])` to create a test double function.
Providing a name is completely optional, but improves readability of failure
messages.

### Aside: inspecting a test double

Before we continue, we can get a better understanding by debugging and invoking
`td.explain(createRandomProblem)`. `td.explain(aTestDouble)` will return an
object describing the calls, stubbings, and invocations made so far against any
test double function, and is a handy way to debug or improve your understanding
of the state of a test at any given point.

At this point, `td.explain` will return:

``` javascript
{
  callCount: 0,
  calls: [],
  description: "This test double `createRandomProblem` has 0 stubbings and 0 invocations."
}
```

### Stubbing a response

Recall that the purpose of this test is not to solve the entire problem, it's
merely to prove out a working relationship between our top-level function and
its three dependencies. Therefore, it's not important that `createRandomProblem`
actually create a real problem yet. In fact, what it returns for the purpose of
this test doesn't even have to resemble a real problem!

Because `createRandomProblem` should need no inputs, we'll "stub" (i.e. configure
a response) it such that the test double returns the string "some problem":

``` javascript
describe('MathProblem', function(){
  // ...
  it('POSTs a random problem', function(){
    td.when(createRandomProblem()).thenReturn('some problem')

    subject.generate()
  })
})
```

As you can see, `td.when` is invoked, and—as if as an example to the reader—the
test double is invoked exactly as we expect it to be inside the subject (in this
case, with no arguments). This returns an object with a method called
`thenReturn`, to which we pass whatever we want `createRandomProblem()` to
return.

At this point, you can `console.log(createRandomProblem())` to verify the
stubbing works, but for now, we don't have enough to tie everything together.
We need the next two test doubles.

### Creating the second test double

Recall that after we create a random arithmetic problem, our plan was to persist
it and tack on an ID of some sort. For the sake of illustration, let's suppose
that we intend for this second dependency to be an instantiable type, also with
its own constructor function.

We'll add an empty constructor & method for that dependency now:

``` javascript
function SavesProblem() {}
SavesProblem.prototype.save = function(){}
```

Next, we'll create a test double designed to mirror `SavesProblem`:

``` javascript
describe('MathProblem', function(){
  var subject, createRandomProblem, savesProblem;
  beforeEach(function(){
    createRandomProblem = td.function('createRandomProblem')
    savesProblem = td.object(SavesProblem)
    subject = new MathProblem(createRandomProblem, savesProblem)
  })
  it('POSTs a random problem', function(){
    // ...
  })
})
```

As you can see above, we used a different method to create this test double!
Because our second dependency is an instantiable type, we used
`td.object([constructor function])` to create a test double for it. This test
double function is smart enough to hunt for any methods defined on the function's
prototype, and therefore will return an object that has a test double function
defined as the property `save`.

(Note: `td.object()` supports no-arg and named test doubles as well, so long as
your runtime supports ES2015 Proxy objects, which as of November, 2015, are only
supported by FireFox and MS Edge.)

### Stubbing with an argument

Now we have what we need to stub the `save` method of `SavesProblem`. Each time
`save` is called, it should return a persisted problem with an ID. Once again,
remember the purpose of this test is to verify the interactions are taking place
as we intend them, so the goal isn't to actually save anything, it's to ensure
`save` is passed the `'some problem'` that will have been returned by our
`createRandomProblem()` test double function.

We can specify exactly that stubbing like so:

``` javascript
describe('MathProblem', function(){
  // ...
  it('POSTs a random problem', function(){
    td.when(createRandomProblem()).thenReturn('some problem')
    td.when(savesProblem.save('some problem')).thenReturn('saved problem')

    subject.generate()
  })
})
```

Once again, we're not quite done yet, but you can check your intermediate
progress by throwing in a `console.log(savesProblem.save(createRandomProblem()))`

### Creating the third test double

By now you're a pro at creating test doubles, and the third one is as
straightforward as the first:

``` javascript
describe('MathProblem', function(){
  var subject, createRandomProblem, savesProblem, submitProblem;
  beforeEach(function(){
    createRandomProblem = td.function('createRandomProblem')
    savesProblem = td.object(SavesProblem)
    submitProblem = td.function('submitProblem')
    subject = new MathProblem(createRandomProblem, savesProblem, submitProblem)
  })
  it('POSTs a random problem', function(){
    // ...
  })
})
```

Note that even though our purpose for this third test double isn't to stub a
return value from `submitProblem`, we create it the same way as we did our
first test double function, which was a stub. That means that testdouble.js test
doubles serve double-duty, configurable as either stubs or being verified (though
you should never need to stub & verify the same interaction).

### Verifying some behavior

It's generally preferable for our code to return meaningful values when possible,
as code that has side effects is harder to read and maintain than so-called pure
functions. In practice, however, functions with side effects are almost
unavoidable, so any test double library worth its salt needs to provide a way
to verify that an invocation took place.

With that said, let's verify that we submit the persisted problem to some remote
server:

``` javascript
describe('MathProblem', function(){
  // ...
  it('POSTs a random problem', function(){
    td.when(createRandomProblem()).thenReturn('some problem')
    td.when(savesProblem.save('some problem')).thenReturn('saved problem')

    subject.generate()

    td.verify(submitProblem('saved problem'))
  })
})
```

As you can see above, this test follows an arrange-act-assert pattern: setup
steps at the top, a one-liner to invoke the code under test, and then our
verification.

Speaking of verification, the API of `td.verify` should look familiar, as it is
symmetrical  to `when`. By saying `td.verify(submitProblem('saved problem')`,
we're telling testdouble.js to throw an error unless `submitProblem` is invoked
with exactly one argument: `'saved problem'`.

Since we haven't implemented the code yet, our test will finally go red with
the failure:

``` javascript
Error: Unsatisfied verification on test double `submitProblem`.

  Wanted:
    - called with `("saved problem")`.

  But there were no invocations of the test double.
```

### Make the test pass by implementing the function

How will we get the test to pass? Our intention is made pretty explicit by the
test double configuration we've done up to this point. First, the subject will
need to create a problem, pass the created problem to `save`, then pass the
result saved problem to `submitProblem`.

Let's wire it all together in our subject now:

``` javascript
function MathProblem(createRandomProblem, savesProblem, submitProblem) {
  this.createRandomProblem = createRandomProblem
  this.savesProblem = savesProblem
  this.submitProblem = submitProblem
}
MathProblem.prototype.generate = function(){
  var problem = this.createRandomProblem(),
      savedProblem = this.savesProblem.save(problem)

  this.submitProblem(savedProblem)
}
```

Ta-da, the test is now green! If it still feels like magic, feel free to add
a little something to the invocation of `submitProblem` like
`this.submitProblem(savedProblem + ' woah')`. Doing so will give the error:

``` javascript
Error: Unsatisfied verification on test double `submitProblem`.

  Wanted:
    - called with `("saved problem")`.

  But was actually called:
    - called with `("saved problem woah")`.
```

Which is as good as evidence as any that the test is verifying the interaction
we specified properly.

## Congratulations!

Great job getting through this first tutorial. We only scratched the surface of
features in testdouble.js, but it was an important first step to understanding
the sort of outside-in TDD workflow we had in mind as we designed the library.

If you got this far and you're left asking "what was the point of all this?" or
"what value did this test really have?", fear not, because that's a completely
reasonable reaction. Not only was this example contrived, but we skipped any
sort of meaningful primer on the goals and benefits of doing outside-in isolation
TDD at all. If you're interested in that topic, we've prepared a [screencast
series](http://is.gd/discovery_testing) introducing one approach to outside-in
called Discovery Testing.

Further reading that documents the features shown off in this tutorial include:

* [Creating test doubles with `function()` and `object()`](4-creating-test-doubles.md)
* [Stubbing responses with `when()`](5-stubbing-results.md)
* [Verifying invocations with `verify()`](6-verifying-invocations.md)
