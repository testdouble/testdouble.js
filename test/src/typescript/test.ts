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

const cat = td.object(["meow"]);
td.when(cat.meow()).thenReturn("meow!");

const bird = td.object({ fly: function(){} });
td.when(bird.fly()).thenReturn("fly!");
