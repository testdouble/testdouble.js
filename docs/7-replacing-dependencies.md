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
instead

In both cases, `td.replace` will grab the real dependency and imitate it with an
appropriate fake:

  * Plain functions are replaced with test double functions of the same name,
    with all properties deep-cloned and any function properties replaced with
    test double functions
  * Plain objects are deep-cloned and all functions are replaced
    with test double functions
  * Constructor functions and ES classes with at least one prototypal function
    defined will be extended by an artificial constructor that will have all the
    original constructor/class's static & prototypal functions overwritten with
    test double functions

After the next call to `td.reset()` (which you should have in an `afterEach` hook
somewhere in your test suite), the real dependencies will all be restored.

If the imitation scheme doesn't suit you or if you don't want your test to drive
out the plumbing of defining the dependency, you can pass a final argument to
`td.replace` that will act as the fake that replaces the real dependency (e.g.
`td.replace('./foo', 42)` will monkey-patch `require` to return `42` for paths
that resolve to that absolute path.

## ES Module support

> IMPORTANT NOTE: ES module support is experimental, and relies on an experimental feature of
> Node.js called [Loaders](https://nodejs.org/api/esm.html#esm_experimental_loaders).

Since version 13, Node.js has native support for ES Modules, i.e. modules that use `import` and
`export` instead of `require` (read all about them
[here](https://nodejs.org/dist/latest/docs/api/esm.html)). This library also supports replacing ES
modules, alongside CommonJS (the regular `require` modules). But since ES modules have slightly
difference semantics, you cannot use `td.replace`, but should rather use `td.replaceEsm` if you want
to replace a module that is an ES module.

Also, since ES modules are asynchronous in nature,
`td.replaceEsm` is also asyncronous, and you should usually `await it`. And lastly, `td.replaceEsm`
always returns an object that contains the doubles of the named exports of the module, and if the
module has a default export, then that object will also contain a `default` property.

Another interesting change is that, just like in Node.js you have to specify the extension when
importing the module (i.e. `import('./brake.mjs')`), so you need to do so when replacing the module.

Otherwise, most of what is
written about `td.replace` also applies to `td.replaceEsm`.

## Node.js

This sounds a little like magic, so let's look at a simple example. Suppose we
write a simple test in `test/lib/car-test.js`:

``` javascript
module.exports = {
  beforeEach: function() {
    var brake = td.replace('../../lib/brake')
    var subject = require('../../lib/car')
  },
  'slowing applies the break': function () {
    subject.slowDown()

    td.verify(brake(10))
  }
}
```

This same, example, using ESM. Given the modules below:

```javascript
// brake.mjs
export default function brake() {...}
export function abs() {...}
// car.mjs
import brake, {abs} from './brake.mjs'
```

You can replace them using the code below:

``` javascript
module.exports = {
  beforeEach: async function() {
    const brakeModule = await td.replaceEsm('../../lib/brake.mjs')
    const subjectModule = await import('../../lib/car.mjs')
  },
  'slowing applies the break': function () {
    subjectModule.default.slowDown()

    td.verify(brakeModule.default(10))
  }
}
```

There are few very important things to note about how to use module replacement
safely (with great power, etc.):

* Most importantly: **move your replacements and requirements into a
  `beforeEach` hook (or equivalent)** and be sure you're calling `td.reset()`
  after each test case. Because `td.replace/replaceEsm('../module/path')` will disrupt
  Node's module loading behavior and cause `require/import()` to return a fake, it
  would cause test pollution to keep the `require/import` stanzas at the top of the
  file
* As a result, if you're using CommonJS, your tests will need to use `require` and not the ES static
  `import` keyword. This _only applies to your test files_, and only if the modules you test are
  CommonJS. however, you can still feel free to use a transpile to change your `import` to `require`
  in your production source files, where it actually matters if you're leveraging a bundling tool
  like Webpack or Rollup. Keep in mind that you'll like be doing a lot of
  `td.replace('../path').default` assignments if you're using default exports, whether you're
  transpiling or using native ES modules.
* `td.replace/replaceEsm` is designed to be used as part of an outside-in test-driven
  development workflow, and so calling `td.replace/replaceEsm` for some path will trigger
  an error until it actually exists and exports the basic shape (e.g. a
  function, or a bag of functions, or a class) that is expected to be consumed
  by the subject under test
* Because `td.replace/replaceEsm` first requires the module being replaced and then
  performs a deep imitation of whatever the real module exports, any
  side-effects the to-be-replaced module has will be inadvertently triggered by
  the test (remember, good modules should be loadable without triggering side
  effects!)
* If you're using native (and not transpiled) ES modules, and you're using `td.replaceEsm`, you need
  to load `testdouble.js` as an ESM loader (more about the why below), using `node
  --loader=testdouble`, or alternatively, if you're using a test runner that does not support
  loaders, you can use `NODE_OPTIONS="node --loader=testdouble" testrunner ...`.

That's a lot of caveats, but so long as your test and module design is simple
and consistent, it's a powerful feature that can drastically simplify the setup
of your isolation tests.

Now, in order to make the above test pass, we first need to create
`lib/brake.js` and export a function, so that testdouble.js knows to replace
`require` calls with a test double function (as opposed to a default
`module.exports` object):

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

If you'd like an example of replacing using transpilers to replacr ES classes that use the `export`
keyword, check out the [babel example project](../examples/babel/test/lib/calculator-test.js). (Note
again that the test itself must fall back to CommonJS-style `require` statements, since module
replacement requires the dependency be loaded after the replacements are configured, which precludes
the use of the static `import` statement.)

### How module replacement works for CommonJS modules (using `require`)

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

### How module replacement works for ES modules (using `import`)

Under the hood, testdouble.js uses a loader (which you run using `node loader=testdouble`). A loader
is a module that can hook into the ES module loading mechanism in an official way. The testdouble
loader ensures that if you call `td.replaceEsm` on an ES Module, the next time that module is loaded
by Node.js, the source Node.js will get from the loader is not the regular source, but rather source
code that contains some replacement code that can be used for the mock doubles.

Also, every time you call `td.replaceEsm` on a module, you generate a new "generation" of that module, so
that the next time Node.js loads that module, it loads the new generation of that replaced module.
If you do `td.reset`, then the original module is loaded instead.

As a result, feel free to use `td.replaceEsm` even _after_ you import the module. This is different
from when using `td.replace` where you must use `td.replace` first before `require`-ing your module.

If you'd like to kick the tires on this, you can play with a [more involved
example project](../examples/node-esm/test/lib/car-test.mjs) found in the
testdouble.js repository.

(All this magic comes courtesy of [quibble](https://github.com/testdouble/quibble), which does the
actual loading and replacing of the module), and is used by `td.replaceEsm` to do its magic.

### Aside: third-party modules

testdouble.js can also replace third-party npm modules. For instance, if you
depend on the module [is-number](https://npmjs.org/package/is-number), you can,
in your test:

```js
var isNumber = td.replace('is-number')
var numbersOnly = require('./numbers-only')
td.when(isNumber('a string')).thenReturn(true) // tee-hee, this is silly

var result = numbersOnly('a string')

assert.equal(result, true)
```

Should pass for a subject:

```js
var isNumber = require('is-number')

module.exports = function (thing) {
  if (!isNumber(thing)) {
    throw new Error('numbers only!')
  }
  return true
}
```

Even though testdouble.js does support replacing third-party npm modules, it is
not recommended unless you own the module! Typically, when practicing the sort
of outside-in test-driven development that testdouble.js is designed to
facilitate, you should keep third-party dependencies at arms-length by only
[mocking what you
own](http://github.com/testdouble/contributing-tests/wiki/Don%27t-mock-what-you-don%27t-own).
But if you're managing lots of internal modules and they're all in a consistent
style such that the line between first-party & third-party code is blurred, then
`td.replace` has you covered and should be able to replace third-party modules
or npm packages just like it can for local paths.

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

***
Previous: [Verifying interactions](6-verifying-invocations.md#verifying-interactions)
Next: [Custom argument matchers](8-custom-matchers.md#custom-argument-matchers)
