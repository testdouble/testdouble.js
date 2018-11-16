# Frequently Asked Questions

Whenever someone asks a particularly salient question about testdouble.js, we'll
log it here for the benefit of anyone reading up on how to make the most use of
the library.

## Why shouldn't I call both td.when and td.verify for a single interaction with a test double?

It's a common mistake to call `td.verify` for an invocation that's already been
stubbed with `td.when`. Some users might feel like this is appropriate,
motivated by a desire to be sure that the test double was invoked as expected,
but if the stubbing was necessary to exercise the desired behavior in the
subject, then adding an additional verification is redundant.

For example, given this function:

``` js
function getName(load, id) {
  return load(id).name
}
```

And this test:

``` js
var load = td.function()
td.when(load(42)).thenReturn({name: "Jane"})

var result = getName(load, 42)

assert(result, "Jane")
td.verify(load(42))
```

The assertion that `result` is `"Jane"` is sufficient to specify the behavior
of the function. The additional `td.verify` call is redundant, because if `load`
had not been invoked with `42`, then there's no way that `getName` could have
returned `"Jane"`, since the stubbing wouldn't have been satisfied. Worse, it
further couples the test to the subject's implementation—if, hypothetically, the
`getName` function were able to determine the correct return value without
calling `load`, the test would start failing even though there would
be nothing wrong with the implementation.

As a result, testdouble.js will print a console warning when it detects that
a stubbed invocation is also being verified.

## Why should I not verify a test double was not called?

Stubbing something wasn't called is usually not necessary. To recap: td.verify should only be used if there's no way to verify the subject did something, which is typically when the test double function has a side effect and doesn't return a value.

For example:

```
describe("example", () => {
  let func;

  beforeEach(() => {
    func = td.function();
    td.when(func()).thenReturn("Nope");
  });

  it('is called when A', () => {
    var result = subject('A', func)

    expect(result).to.equal('pants')
  });

  it('is never called when B', () => {
    var result = subject('B', func)

    expect(result).to.equal('cookie')
    // td.verify(func(), { times: 0 }); // <- this would be redundant and over-prescriptive.
  });
});
```

Since you're stubbing-and-not-verifying this test double function in other cases, that means you're able to assert the subject must do something with that value that you're able to assert in those cases. My default inclination would be to continue to assert the return value of the subject in the case where the stubbing is unnecessary, and simply not care about whether the stub is invoked or not.

There are a few motivations I see most often for wanting to make sure an otherwise stubbed method is not called:

- A desire to specify the interaction. Stubbing specifies this indirectly, but there's nothing in the test preventing an extraneous call to the test double. Well, there's nothing preventing the subject from doing all manner of other extraneous things. You could spend hours making sure the subject doesn't call other third-party functions it has theoretical exposure to, but that would be an unnecessary test (see Necessary & Sufficient). If that's your motivation, I recommend just letting it go unspecified. It's not the responsibility of the test to ensure everything that does not happen.
- A desire to ensure performance is not wasted. If the subject does call func extraneously, just delete the unnecessary call and recoup the performance benefit; your tests provide you a safety net that the behavior is correct, which makes such a refactor safe. It's not a responsibility of a unit test to ensure that a fucntion is maximally performant—it's the job of your tests to encode the intended behavior of the subject so that refactoring implementation details like this one can be done with confidence.
- To cover a case where calling the stubbed function under a particular case would, in a production setting, throw an error. If this is the case, then just update the stubbing in the test with `thenThrow()`. If the test continues to pass, then the subject wasn't called. This is preferable to `td.verify` for at least two reasons:
  - It is more consistent with the other stubbings. If you think of a test double as a typed entity (e.g. "a function that has a result" vs. "a function that has a useful side effect"), then treating that type consistently confers a benefit to the reader.
  - Setting up a `thenThrow` stubbing conveys intent about the dependency under the given condition—a reader will see it and logically conclude that a real func would explode with that input. Simply verifying it wasn't called doesn't really convey any intention other than, I guess, not wanting to waste a call.
So the last case—where calling the function would raise an error—is the only one I'd actually test for, and I'd do it like this:

```
  it('is does not blow up when B', () => {
    td.when(func()).thenThrow('invalid input!')

    var result subject('B', func)

    expect(result).to.equal('cookie')
  });
```

***
Previous: [Plugins](A-plugins.md#plugins)
Next: [Configuration](C-configuration.md#configuration)
