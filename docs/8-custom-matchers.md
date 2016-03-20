### Custom argument matchers

In addition to the built-in argument matchers described along with
[stubbing](5-stubbing-results.md#loosening-stubbings-with-argument-matchers),
it's easy to define custom argument matchers to meet your specific needs as well.

There's nothing magical about matchers. Any object passed into a `when()` or
`verify()` invocation that has a `__matches` function on it and returns truthy
when it matches and falsey when it doesn't is considered a matcher by
testdouble.js. That said, we provide a `td.matchers.create()` helper for creating
your own custom matchers in a way that'll help ensure your users will get better
messages from `td.explain` calls and `td.verify` failures.

(For the record, arguments without a `__matches` property will only match an
actual invocation if it passes lodash's deep
[_.isEqual](https://lodash.com/docs#isEqual) test.)

The examples in this document assume you've aliased `testdouble` to `td`.

#### Example

Here's a naive implementation of a matcher named `isA` which will check whether
the expected type of an argument matches the type of the argument actually passed
to the test double function from the subject under test.

``` javascript
isA = td.matchers.create({
  name: 'isA',
  matches: function(matcherArgs, actual) {
    var expected = matcherArgs[0]
    return actual instanceof expected
  }
})
```

Once defined, the above function can be used in a test like this:

``` javascript
var datePicker = td.function()

td.when(datePicker(isA(Date))).thenReturn('good')

datePicker(new Date()) // 'good'
datePicker(5) // undefined
```

#### td.matchers.create API

The `create` function takes a configuration object with the following properties

* **matches(matcherArgs, actual)** - _required_ - a function that returns truthy
when an `actual` argument satisfies the matcher's rules, given what the user
passed to the matcher as `matcherArgs` when setting it up. For instance, if
`td.when(func(isFooBar('foo','bar')).thenReturn('baz')` is configured, then
`func('biz')` is invoked, then `isFooBar`'s `matches` function will be invoked
with `matcherArgs` of `['foo','bar']` and `actual` of `'biz'`
* **name** - _optional_ - a string name for better messages. A function can
also be provided, which will be passed the user's `matcherArgs` and should return
a string name
* **onCreate(matcherInstance, matcherArgs)** - _optional_ - a function invoked
whenever an instance of a matcher is created to give the matcher author an
opportunity to mutate the matcher instance or have some other side effect. The
`td.callback` functionality of the library depends on this option

For some examples of `td.matchers.create()` in action, check out the
[built-in matchers](src/matchers/index.coffee) provided by testdouble.js.
