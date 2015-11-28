### Custom argument matchers

In addition to the built-in argument matchers described along with
[stubbing](5-stubbing-results.md#loosening-stubbings-with-argument-matchers),
it's easy to define custom argument matchers to meet your specific needs as well.

There's nothing magical about matchers. Any object passed into a `when()` or
`verify()` invocation that has a `__matches` function on it and returns truthy
when it matches and falsey when it doesn't is considered a matcher by
testdouble.js. Anything without a `__matches` function will only match an
actual invocation if it passes lodash's deep
[_.isEqual](https://lodash.com/docs#isEqual) test.

The examples in this document assume you've aliased `testdouble` to `td`.

#### Example

Here's a naive implementation of a matcher named `isA` which will check whether
the expected type of an argument matches the type of the argument actually passed
to the test double function from the subject under test.

``` javascript
isA = function(expected) {
  return {
    __matches: function(actual) {
      return actual instanceof expected;
    }
  }
}
```

Once defined, the above function can be used in a test like this:

``` javascript
var datePicker = td.function()

td.when(datePicker(isA(Date))).thenReturn('good')

datePicker(new Date()) // 'good'
datePicker(5) // undefined
```
