# Creating Test Doubles

Unlike most classical or functional langauges, JavaScript under test might depend on many sorts of things: plain objects, instantiable constructor functions, ES2015 classes, or regular old functions. As a result, any good test double library needs to provide terse and convenient ways to create fake versions of all of these things.

The examples below will walk through the different ways to create new test doubles. Each example assumes you've aliased `testdouble` to `td`.

## td.function([name])

**Note that `td.func` is available as an alias of `td.function`.**

To create a fake function with test double, we use the `function` function. At its simplest, invoking:

``` javascript
var bark = td.function()
```

`bark` is now a test double function, meaning it can be configured to stub a particular response with `td.when`, its invocations can be verified with `td.verify`, and its current state can be introspected with `td.explain`.

To provide yourself with better messages, we recommend assigning a name to the function; this is particularly important whenever a test will have more than one double in use at a time:

``` javascript
var woof = td.function('.woof')
```

## td.object()

Creating a one-off function is really easy, but often our subjects will depend on objects with functions as properties. Because we don't want to encourage the use of [partial mocks](https://github.com/testdouble/contributing-tests/wiki/Partial-Mock),  test double offers a number of ways to create objects whose function properties have all been replaced with fake functions.

Because there's a number of ways to create objects of test doubles, it's important that we provide some guidance on which tool to use when. Because we use test doubles to practice outside-in test-driven development, most of the fake objects we use represent code *that doesn't exist yet*. As a result, there are two styles you might take:

* Pass `td.object()` a real **constructor** with functions defined on its prototype object, an **ES2015 class**, or a **plain JavaScript object** which contains functions as properties. testdouble.js will mirror either of these by replacing all the functions it detects, including those inherited from its prototype chain. If you practice this style, it means part of your test-driven workflow will require you to define those constructors and objects as you go in your production code. This is a great way to take advantage of the TDD workflow to implement a skeleton of your object graph as you work, all-the-while keeping the contracts between your subject and its dependencies explicit enough to catch failures when you change the contract between the [subject](https://github.com/testdouble/contributing-tests/wiki/Subject) and its dependencies (i.e. if you change the name of a dependency's function, the test double function would disappear and break the caller's test).
* Pass `td.object()` an **array of function names** or (if using a runtime that implements [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) a **name for the object**. This style makes prototyping interactions easier because it doesn't require the author to define production-scope functions of dependencies while authoring the caller's test. Conversely, it runs the risk of "fantasy green" tests that continue passing even if a dependency's functions change in the future

No style is right or wrong, as they both have trade-offs (full disclosure: when practicing TDD in a greenfield application, the present author usually prefers the former style). However, we would encourage teams to pick one style and apply it consistently to reduce the cognitive load of keeping straight the expected behavior of tests when depended-on objects change.

### Creating objects that mirror production dependencies

#### object(someConstructorFunction)

Suppose you have a constructor function:

``` javascript
function Dog(){}
Dog.prototype.bark = function(){}
Dog.prototype.woof = function(){}
```

To create a test double object that has functions `bark` and `woof`, simply pass `Dog` to `object()`

``` javascript
var dog = td.object(Dog)

dog.bark // a test double function named 'Dog#bark'
```

At this point, you can pass the fake `dog` object to your subject. If you'd prefer for your subject to instantiate its own `Dog` and still receive the same test doubles visible in your test, consider helping us implement a `td.constructor` API as described in [this issue](https://github.com/testdouble/testdouble.js/issues/54).

#### object(someObjectWithFunctions)

Suppose you have an object with some functions as properties (and perhaps some non-function properties). If passed to `td.object()`, testdouble.js will do a deep copy of the object and then a shallow search-and-replace of any functions found on the object while and return it.

So, given:

``` javascript
var fish = {
  eat: function(){}
  swim: function(){}
  details: {
    age: 10,
    name: 'goldie'
  }
}
```

Then you could fake the fish out with:

``` javascript
var fish = td.object(fish)

fish.eat // a test double function named '.eat'
fish.details.age // still `10`
```

### Creating objects that don't depend on production dependencies

#### object(functionNames)

If you pass `td.object` an array of strings, it'll return a plain object with those properties set as named test double functions.

``` javascript
var cat = td.object(['meow', 'purr'])

cat.meow // a test double function named 'meow'
```

### object([objectName])

If passed either a string name or no arguments at all, `td.object` will return an [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object designed to forward any property access as if it was a test double function. By using `Proxy`, testdouble.js is able to intercept calls to properties that don't exist, immediately create a new test double function, and invoke that function for use in either stubbing or verifying behavior.

``` javascript
var parrot = td.object('Parrot')

parrot.squawk // a test double function named 'Parrot#squawk'
```

#### Excluding certain methods from Proxy-based test doubles

Sometimes, your subject code will check to see if a property is defined, which
may make a bit of code unreachable when a dynamic test double responds to every
single accessed property.

For example, if you have this code:

``` javascript
function leftovers(walrus) {
  if(!walrus.eat) {
    return 'cheese';
  }
}
```

You could create a test double walrus that can reach the cheese with this:

``` javascript
walrus = td.object('Walrus', {excludeMethods: ['eat']});

leftovers(walrus) // 'cheese'
```

By default, `excludeMethods` is set to `['then']`, so that test libraries like
Mocha don't mistake every test double object for a Promise (which would cause the
test suite to time out)

## Conclusion

As you can see, there are a plethora of ways to create test doubles with testdouble.js, each designed to handle a different style of organizing JavaScript code. We recommend on landing on one consistent style (e.g. each module as one function) for each project, which in turn would encourage one consistent style of creating test doubles. This API is written to be flexible for a number of potential contexts across objects, but it has come at the cost of a large enough surface area that if any project were to make ample use of all or most of the above invocation styles, it would confuse readers.
