import * as td from "../../../";

// dummies

class Dog {
  constructor() {};
  bark(): string { return "bark! bark!" }
}

function sum (first: number, second: number): number {
  return first + second
}

// td.functions()

const f = td.function();
td.when(f(10)).thenReturn(10);
td.when(f(1)).thenThrow(new Error("ok"));
td.when(f(td.matchers.isA(String))).thenDo(function(s: string) { return s; });
td.when(f(td.matchers.not(true))).thenResolve("value");
td.when(f(td.matchers.not(false))).thenReject(new Error("rejected"));

const fakeSum = td.function(sum);
td.when(fakeSum(1, 2)).thenReturn(3);

const fakerSum = td.function("sum");
td.when(fakerSum(1, 2)).thenReturn(3);

const fakestSum = td.function("sum");
td.when(fakestSum(1, 2)).thenReturn(3);

// td.func()

const ff = td.func();
td.when(ff(10)).thenReturn(10);
td.when(ff(1)).thenThrow(new Error("ok"));
td.when(ff(td.matchers.isA(String))).thenDo(function(s: string) { return s; });
td.when(ff(td.matchers.not(true))).thenResolve("value");
td.when(ff(td.matchers.not(false))).thenReject(new Error("rejected"));

// td.constructor()

const dog = td.constructor(Dog);
td.when(dog.bark()).thenReturn("bark!");

// td.object()

const bird = td.object({ fly: function(){} });
td.when(bird.fly()).thenReturn("fly!");

const bear = td.object<Dog>("Bear");
td.when(bear.bark()).thenReturn("bark!");

// td.replace()

td.replace({}, "prop");
td.replace({}, "prop", 42);
td.replace("../../..");
td.replace("../../../", 42);

// td.verify()

td.verify(f());
td.verify(f(), { times: 1 });
td.verify(f(), { ignoreExtraArgs: false });
td.verify(f(), { ignoreExtraArgs: true, times: 2 });

// td.explain()

const explanation = td.explain(f);
console.log(
  explanation.description,
  explanation.calls.length,
  explanation.callCount
);
