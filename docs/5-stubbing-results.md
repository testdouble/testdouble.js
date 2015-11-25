# Stubbing behavior

In test double parlance, to "stub" a method or function is to configure it to return a particular response for  a given set of inputs. When used as a noun or referred to as a "stubbing", a person could be referring to the configured test double itself or the act of returning an artificial response. When the code that you're testing depends on other units of code to do its job, the (hopefully, vast) majority of those units are invoked with a set of inputs to return some useful output. As a result, when practicing an outside-in test-driven-development workflow, being able to specify that type of interaction in a readable and specific way is very important.

In testdouble.js, we stub behavior with the `testdouble.when()` function. In this chapter, we'll discuss simple stubbings, matching inexact arguments, and advanced configuration options that testdouble.js supports.

All of the examples in this document presume the reader has aliased `testdouble` to `td`.

## testdouble.when()

The basic structure of a stubbing configuration follows:

```
var quack = td.function('quack')

td.when(quack()).thenReturn('some return value')

quack() // returns 'some return value'
```

As JavaScript APIs go, this should strike readers as unusual, but it's an intentional design. Note that inside the invocation operator `()` of `td.when` that the entire call to the test double is, for lack of a better term, *rehearsed*. The goal is to demonstrate an invocation of the test double function just as the test expects the subject to invoke the dependency it represents—to a level of precision desired by the situation.

> If the above is still bothering you, note that the implementation of testdouble.js doesn't care what is "passed" into `td.when()`'s first argument position. In fact, what the library will actually do is simply pop the most recent call to _any test double_ off the global call stack whenever `when()` is invoked and presume that it was the "rehearsal" invocation for the next stubbing, should `thenReturn` be subsequently invoked.

For now, only `thenReturn` is supported as a response type. For whatever reason, we haven't found an urgent need to implement two other typical responses, `thenDo` (to invoke a function that has some side effect, [#8](https://github.com/testdouble/testdouble.js/issues/8)) and `thenThrow` (to throw some error, [#7](https://github.com/testdouble/testdouble.js/issues/7)), but we'd gladly accept pull requests for either. 

## Simple, exact argument stubbing

When practicing outside-in TDD, unit tests are typically completely isolated. As a result, in most cases it's completely expected that the test will be able to (and will desire to) specify the exact interaction the subject should have with each of its dependencies. The stubbing API exposed by testdouble.js assumes that the "rehearsed" invocation in a stubbing is made with the exact arguments the subject is expected to use. (When that is not desired, read about matchers below for ways to loosen that coupling when desired.)

### No-argument stubbings

The easiest invocation to stub is a no-arg invocation. In fact, you've already seen an example!

```
var quack = td.function('quack')

td.when(quack()).thenReturn('some return value')

quack() // returns 'some return value'
```

### n-argument stubbings

You can also specify arbitrarily many arguments. Given the example above, you might say:

```
td.when(quack('soft')).thenReturn('quack')
td.when(quack('soft', 2)).thenReturn('quack quack')
td.when(quack('soft', 2, 'hard', 3)).thenReturn('quack quack QUACK QUACK QUACK')

quack('soft') // 'quack'
quack('soft', 2) // 'quack quack'
quack('soft', 2, 'hard', 3) // 'quack quack QUACK QUACK QUACK'
```

As you can see above, a test double function can be stubbed multiple times for different sets of arguments.

#### Aside: unconditional stubbing

Note that these stubbings will only return their stubbed value if called exactly as they're demonstrated when `td.when()` is invoked. That means, given the examples above, that invoking:

```
quack('hi')
quack([1,2,3],4)
quack('anything','at','all')
```

Will each return `undefined`. This differs from the default stubbings one might create with Jasmine or Sinon.js, but it's by design. When using test doubles to facilitate an isolated test of the collaboration of a subject and its dependencies, the arguments your subject passes around _probably matter somewhat_. As a result, testdouble.js defaults to assuming that the inputs passed to functions have a material impact on their output.

For instance, if the stubbing was unconditional, we might pat ourselves on the back for writing this test:

```
function sitInTraffic(horn){
  return horn() + '!'
}

var horn = td.function()
td.when(horn()).thenReturn('beep')
assert.equal('beep!', sitInTraffic(horn))
```

But if our stubbings were unconditional, that means we could change the implementation to this without seeing our test fail:

```
function sitInTraffic(horn){
  return horn('no really do not honk') + '!'
}
```

Which would probably not be our intention. As a result, testdouble.js only loosens its rules about whether a stub is said to be "satisfied" when you explicitly indicate that it should.

### One-liner stubbings

Sometimes, when all you need from a test double is a one-off stubbing, you'll want to express both the creation of the test double and that stubbing as tersely as possible. You can do this, since `thenReturn` will return the test double instance. That means that:

```
var woof = td.function()
td.when(woof()).thenReturn('bark')
```

And this:

```
var woof = td.when(td.function()).thenReturn('bark')
```

Are equivalent to one another.

### Stubbing sequential return values

Sometimes your subject should invoke a dependency multiple times in the same way. For instance perhaps your subject wants to invoke a `randomSound()` function to return `quack`, then `honk`, then `moo`. This can be configured by passing additional arguments to `thenReturn()`, like so:

```
var randomSound = td.function('randomSound')

td.when(randomSound()).thenReturn('quack', 'honk', 'moo')

randomSound() // 'quack'
randomSound() // 'honk'
randomSound() // 'moo'
randomSound() // 'moo'
```

As you can see, any additional invocations will continue to return the final stubbing in the sequence.

### Loosening stubbings with argument matchers

An "argument matcher" is a special function which, when passed to a test double function during its `td.when()` "rehearsal" invocation, can modify the default behavior of whether a particular argument will match a given invocation. (That default behavior, recall, is to expect each argument to be deeply equivalent to the actual invocation.) 

Out of the box, testdouble.js ships with a handful of matchers. They are:

#### td.matchers.anything()

When passed `td.matchers.anything()`, any invocation of that test double function will ignore that parameter when determining whether an invocation satisfies the stubbing. For example:

```
var bark = td.function()

td.when(bark(td.matchers.anything())).thenReturn('woof')

bark(1) // 'woof'
bark('lol') // 'woof'
bark() // undefined
bark(2, 'other stuff') // undefined
```

#### td.matchers.isA()

When passed `td.matchers.isA(someType)`, then invocations of the test double function will satisfy the stubbing when the actual type matches what is passed to `isA`. For example:

```
var eatBiscuit = td.function()

td.when(eatBiscuit(td.matchers.isA(Number))).thenReturn('yum')

eatBiscuit(5) // 'yum'
eatBiscuit('stuff') // undefined
eatBiscuit() // undefined
```

While `Number` is shown above, it will work for any built-in type (e.g. `String` or `Date`) or any named custom prototypal constructors defined by the user.

#### td.matchers.contains()

When passed `td.matchers.contains()`, then a stubbing can be loosened to be satisfied by any invocations that simply contain the portion of the argument. This works for several types, including strings, arrays, and objects.

##### Strings

Using `contains` on a  string argument is pretty straightforward:

```
var yell = td.function()

td.when(yell(td.matchers.contains('ARGH'))).thenReturn('AYE')

yell('ARGH') // 'AYE'
yell('ARGHHHHHHH') // 'AYE'
yell('ARG') // undefined
```

#### Arrays

Here's how to use `contains` with an array argument:

```
var jellyBeans = td.function()

td.when(jellyBeans(td.matchers.contains('popcorn', 'apple'))).thenReturn('yum')

jellyBeans(['grape', 'popcorn', 'strawberry', 'apple']) // 'yum'
jellyBeans(['grape', 'popcorn', 'strawberry']) // undefined

```

#### Objects


