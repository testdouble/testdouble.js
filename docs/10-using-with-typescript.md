# Using with TypeScript

## Interfaces

You can create an object with methods exposed as test doubles that are typed according to the passed interface. This comes very handy in unit testing. Without the typesafety we could be making our tests pass while implementing the functionality that does not apply to the contract.

Let's create a mocked object for a following interface:

```typescript
interface IUserRepository {
  findByName(name: string): string;
}

const mockedRepository = td.object<IUserRepository>();
```

Now we can work with it as with any other testdouble object:

```typescript
td.when(mockedRepository.findByName("Alice")).thenReturn("Alice Alicy");

const value = mockedRepository.findByName("Alice");
expect(value).toEqual("Alice Alicy");
```

What's different is that we get the typesafety - meaning, typescript will alert us in following three situations:

```typescript
td.when(mockedRepository.findByName(3)).thenReturn("Alice Alicy");
```

with
`TS2345: Argument of type '3' is not assignable to parameter of type 'string'.`

And:

```typescript
td.when(mockedRepository.findByNaame("Alice")).thenReturn("returnedString");
```

with
`TS2551: Property 'findByNaame' does not exist on type 'IUserRepository'. Did you mean 'findByName'?`

And finally:

```typescript
td.when(mockedRepository.findByName("Alice")).thenReturn({ lastName: "Alicy" });
const found = mockedRepository.findByName("Alice");
expect(found.lastName).toEqual("Alicy");
```

gives us: `TS2339: Property 'lastName' does not exist on type 'string'.`

## Function Types

Similarly to working with interfaces you can define a function type, and create a test double based on it:

```typescript
type pickFirstFrom = (strings: string[]) => string;
const mockedPickFirst = td.func<pickFirstFrom>();
```

Again, typescript helps us mock properly:

```typescript
mockedPickFirst("myString");
```

`TS2345: Argument of type '"myString"' is not assignable to parameter of type 'string[]'.`

And also ensures that we don't wrongly use returned values:

```typescript
td.when(mockedPickFirst(["", ""])).thenReturn({ abc: () => {} });
const result = mockedPickFirst(["", ""]);
result.abc();
```

Gives us:
`TS2339: Property 'abc' does not exist on type 'string'.`

## Abstract and concrete classes

Abstract and concrete classes work similarly to the interfaces:

```typescript
abstract class MyAbstractRepository {
  findByName(name: string): string;
}

const mockedRepository = td.object<MyAbstractRepository>();
td.when(mockedRepository.findByName("Alice")).thenReturn("Alice Alicy");
```

For classes:

```typescript
class MyRepository implements IUserRepository {
  findByName(name: string): string {
    return "";
  }
}

const mockedRepository = td.object<MyRepository>();
td.when(mockedRepository.findByName("Alice")).thenReturn("Alice Alicy");
```

## On reasoning behind using abstractions

There is a crucial difference between using abstract classes/interfaces instead of concrete classes (implementations). 
It's the D (as Dependency Inversion) in the SOLID principles. 
Putting aside explanation of the Dependency Inversion itself - we will focus only on the specifics of it in the context of testing in TypeScript.
  
If your test and subject of your test only depend on the abstractions (types, interfaces, abstract classes), instead of specific implementations, your test won't rerun when the specific implementation changes. It also allows you to really go outside in without even touching or thinking about the implementation. 

To illustrate with an example. We want to have a service that will greet a user. It will first fetch it's last name from some kind of a repository. The repository could internally use MongoDB, a REST based microservice, memory or file-based store, at this point we don't care. We are only defining a contract. Let's start with a test:

```typescript
test("Greet a user", () => {
  const mockedMyInterface = td.object<IUserRepository>();
  td.when(mockedMyInterface.findByName("Alice")).thenReturn("Alicy");
  const subject = new UserService(mockedMyInterface);
  
  const result = subject.greet("Alice");
  
  expect(result).toEqual("Hello Alice Alicy!");
});
```

We defined the API we need. With current IDEs and TypeScript support creating the Interface and the Class is almost automatic.

![Implementation](http://g.recordit.co/ezNnNi6oEH.gif)

From there we can move the UserService class and IUserRepository definition to their own files.

At this point we don't even need to have (or shouldn't have, for that matter) the UserRepository implemented!
And once we do implement it, we can refactor its internals all we want, and the unit test for the service will not have to rerun. The only time when the service test will have to rerun will be when either: 
- implementation of the service changes
- contract of the interface changes

Compare it to this situation:

```typescript
import { UserService } from "./UserService";
// Changed here
import { UserRepository } from "./repositories/UserRepository";
test("Greet a user", () => {
  const mockedMyInterface = td.object<UserRepository>();
  td.when(mockedMyInterface.findByName("Alice")).thenReturn("Alicy");
  const subject = new UserService(mockedMyInterface);
  // (..)
});
```

Assuming a `UserService.ts` file:

```typescript
import { UserRepository } from "./repositories/UserRepository";
export class UserService {
  constructor(private userRepository: UserRepository) {}
  // (..)
}
```

We coupled our service to a particular implementation of the repository. Now, every time it changes, our test will rerun. Additionally, since we import the specific UserRepository it might load (and transpile) a ton of stuff we don't need, making the test slower. 
We can use td.replace to mitigate the problem of loading unnecessary things ( [Replacing dependencies with test doubles](7-replacing-dependencies.md#replacing-real-dependencies-with-test-doubles) ). Nonetheless any kind of current JS smart test watchers that build the tree of the codebase based on its dependencies will still treat the UserService file as depending on the UserRepository - meaning, if you change the UserRepository, it will run tests for the service. In large codebases this can be a difference between running a handful of tests and running hundreds of them. 
