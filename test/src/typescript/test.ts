// Run `npm run test:typescript` to ensure TypeScript works correctly
import { assert } from 'chai'

//td library under test
import * as td from "../../../";

class Dog {
  bark() {}
}

const dog = td.constructor(Dog);
td.when(dog.prototype.bark()).thenReturn("woof!");

const bird = td.object({ fly: function(){} });
td.when(bird.fly()).thenReturn("swoosh!");

class Bear { constructor() {}; sleep() {}; };
const bear = td.object<Bear>("Bear");
td.when(bear.sleep()).thenReturn("zzzzzz");

const testObject = {
  funk: function() {}
}

td.replace(testObject, "funk");
td.replace(testObject, "funk", () => 42);
td.replace("../../..");
td.replace("../../../", 42);

const f = td.function();
td.when(f(10)).thenReturn(10);
td.when(f(1)).thenThrow(new Error("ok"));
td.when(f(td.matchers.isA(String))).thenDo(function(s: string) { return s; });
td.when(f(td.matchers.not(true))).thenResolve("value");
td.when(f(td.matchers.not(false))).thenReject(new Error("rejected"));

f()
td.verify(f());
td.verify(f(), { times: 1 });
td.verify(f(), { ignoreExtraArgs: false });
td.verify(f(), { ignoreExtraArgs: true, times: 1 });

const explanation = td.explain(f);

console.log(
  explanation.description,
  explanation.calls.length,
  explanation.callCount
);

assert.equal(explanation.description.split('\n')[0], 'This test double has 5 stubbings and 1 invocations.')