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

