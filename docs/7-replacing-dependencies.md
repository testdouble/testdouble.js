# Replacing Real Dependencies with Test Doubles

All of these test doubles aren't of much value if your subject can't reference
them, so testdouble.js provides some conveniences to swapping out your subject's
real dependencies for fake ones with its `td.replace` function.

At present, `td.replace` provides two mechanisms for providing test doubles to
your test subject:

* **Object-property replacement.** By passing
`td.replace(someObject, 'nameOfProperty')`, testdouble.js will retain a reference
to `someObject.nameOfProperty`, and replace it during your test
* **Node.js module replacement.** By passing
`td.replace('../path/to/dependency')`, testdouble.js will intercept calls to
`require` that `dependency` module and ensure your subject is handed a fake
instead (requires Node.js 0.11 or greater)

In both cases, `td.replace` will grab the real dependency and imitate it with an
appropriate fake:

  * Plain functions are replaced with test double functions of the same name
  * Plain objects are shallow-cloned and their top-level functions are replaced
  with test double functions
  * Constructor functions with at least one prototypal function defined will
  _return_ a plain object of test double functions but will be _replaced by_ an
  artificial constructor that, when instantiated, will delegate to those same
  test double functions

After the next call to `td.reset()` (which you should have in an `afterEach` hook
somewhere in your test suite), the real dependencies will all be restored.

If the imitation scheme doesn't suit you or if you don't want your test to drive
out the plumbing of defining the dependency, you can pass a final argument to
`td.replace` that will act as the fake that replaces the real dependency (e.g.
`td.replace('./foo', 42)` will monkey-patch `require` to return `42` for paths
that resolve to that absolute path.

## Node.js

This sounds a little like magic, so let's look at a simple example. Suppose we
write a simple test in `test/lib/car-test.js`:

``` javascript
var brake = td.replace('../../lib/brake'),
    subject = require('../../lib/car')

subject.slowDown()

td.verify(brake(10))
```

In order to make the above test pass, we first need to create `lib/brake.js` and
export a function, so that testdouble.js knows to replace `require` calls with
a test double function (as opposed to a default `module.exports` object):

``` javascript
module.exports = function(){}
```

Once the dependency is prototyped, we can implement `lib/car.js` in such a way
as to make our little test pass:

``` javascript
var brake = require('./brake')

module.exports.slowDown = function(){
  brake(10)
}
```

As you can see, each file listing references the correct relative paths to the
replaced dependency. From the perspective of the test, the `brake` module is in
`'../../lib/brake'`, but from the perspective of the subject, `brake` is in
`'./brake'`.

If you'd like to kick the tires on this, you can play with a [more involved
example project](../examples/node/test/lib/car-test.js) found in the
testdouble.js repository. For a more formal discussion of the `replace()`
API, read on.

### How module replacement works

Under the hood, testdouble.js uses a module called
[quibble](https://github.com/testdouble/quibble) that facilitates `td.replace`'s
behavior by monkey-patching Node's `require` function (specifically,
`Module._load`). When `td.replace` is invoked for a module, quibble will begin
intercepting any `require` calls made in that file and—bypassing the Node.js
module cache—return a test double instead of the actual module that resolves to
the same absolute path as whatever path was passed to `td.replace`.

As a result, keep in mind that you must **call `td.replace` for each of your
subject's dependencies before you `require` your subject itself**. If you
`require` your subject before calling `td.replace`, it will load normally
(potentially from the module cache) and any calls to `td.replace` will be too
late to have their intended effect).

### Aside: third-party modules

If you're curious why testdouble.js doesn't support replacing third-party
modules, you can see our commentary on why we "[don't mock what we don't
own](B-frequently-asked-questions.md#why-doesnt-tdreplace-work-with-external-commonjs-modules)".

## Browser

Given the eclectic array of browser JS namespacing, module loading, and packaging
schemes (not to mention the limited runtime introspection available to ES
`import` statements), testdouble.js doesn't try solve for every front-end module
and packaging scheme. For many projects, the object-property replacement scheme
will be good enough. For many others, `td.replace` could be used in a test helper
function to patch module schemes like AMD.

Using global-variable namespacing to carry forward our simple example above, we
could write this test:

``` javascript
var brake = td.replace(app, 'brake')
    subject = app.car

subject.slowDown()

td.verify(brake(10))
```

First, the test will fail until we define `app.brake` as a function:

``` js
app.brake = function(){}
```

Now we can write the function to make the test pass:

``` js
app.car = {
  slowDown: function() {
    app.brake(10)
  }
}
```

Once again, it is **very important** when using this feature that [`td.reset()`
is invoked after each test](1-installation.md#resetting-state-between-test-runs),
or else bizarre and terrible things will happen.

## td.replace() API

To recap, `td.replace` has two "modes", for lack of a better term, which result
in relatively disparate method signatures. So let's spell those out here:

### td.replace(object, propertyName, [manualReplacement])

When `td.replace`'s first argument is anything other than a string, it assumes
you're providing the object on which some property should be replaced.

The second argument, `propertyName`, which must be a string of the same name as
some property already defined on `object` (if undefined properties were allowed
to be replaced, minor errors like misspelling would take much longer to catch).
It must be a string because `td.replace` needs to know not just its value, but
where to replace it the next time someone calls `td.reset()`.

As discussed at the top, most of the time `td.replace` will successfully infer
the right type of fake thing to set on `object` and to return. For other cases,
you can pass a third `manualReplacement` argument to specify the value to be
set on `object[propertyName]`.

`td.replace` typically returns the fake thing it sets on `object`, with the
exception of constructor function properties. In that case, it will return a
plain object of test double functions to the test, but set `object[propertyName]`
to a constructor function that delegates to those test double functions only
after it's been instantiated with `new`.

### td.replace(relativePathToModule, [manualReplacement])

When the first argument to `td.replace` is a string, it assumes you're replacing
a Node.js module dependency and that `relativePathToModule` is, as its name
suggests, a relative path from the test to the module being faked.

In a TDD workflow, this is often the first step to figuring out where that
module should reside, and so `td.replace` will throw an error until it exists
and can be loaded. Once defined, it will return a fake thing based on the same
inferences discussed above and replace subsequent calls to `require` for that
module until the next call to `td.reset()`

Also, as mentioned above, if the inference `td.replace` isn't appropriate or the
path shouldn't exist yet, a second argument `manualReplacement` can be provided
to short-circuit any attempts to load and imitate a module at
`relativePathToModule`.


