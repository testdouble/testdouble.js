import * as td from "../../../";

const f = td.function();
td.when(f(10)).thenReturn(10);
td.when(f(1)).thenThrow(new Error("ok"));
td.when(f(td.matchers.isA(String))).thenDo(function(s: string) { return s; });
td.when(f(td.matchers.not(true))).thenResolve("value");
td.when(f(td.matchers.not(false))).thenReject(new Error("rejected"));

class Dog {
  bark() {}
}

const dog = td.object(Dog);
td.when(dog.bark()).thenReturn("bark!");

const bird = td.object({ fly: function(){} });
td.when(bird.fly()).thenReturn("fly!");

td.replace({}, "prop");
td.replace({}, "prop", 42);
td.replace("../../..");
td.replace("../../../", 42);

td.verify(f());
td.verify(f(), { times: 1 });
td.verify(f(), { ignoreExtraArgs: false });
td.verify(f(), { ignoreExtraArgs: true, times: 2 });

const explanation = td.explain(f);
console.log(
  explanation.description,
  explanation.calls.length,
  explanation.callCount
);
