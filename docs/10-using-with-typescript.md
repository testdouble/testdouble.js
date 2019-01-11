# Using with TypeScript

## Interfaces

You can create an object with methods exposed as testdoubles that are typed according to the passed interface.

Let's create a mocked object for a following interface:

```typescript
interface IUserRepository {
  findByName(name: string): string;
}

const mockedRepository = td.object<IUserRepository>();
```

Now we can work with it as any other testdouble:

```typescript
td.when(mockedMyInterface.findByName("Alice")).thenReturn("Alice Alicy");

const value = mockedMyInterface.findByName("Alice");
expect(value).toEqual("Alice Alicy");
```

What's different is that we get the typesafety about our calls, so, typescript will alert as in following three situations:

```typescript
td.when(mockedMyInterface.findByName(3)).thenReturn("returnedString");
```

with
`TS2345: Argument of type '3' is not assignable to parameter of type 'string'.`

```typescript
td.when(mockedMyInterface.findByNaame("passedString")).thenReturn(
  "returnedString"
);
```

`TS2551: Property 'findByNaame' does not exist on type 'IUserRepository'. Did you mean 'findByName'?`

## Function Types

Similarly to working with interfaces you can define a function type, and use that:

```typescript
type pickFirstFrom = (strings: string[]) => string;
const mockedPickFirst = td.func<pickFirstFrom>();
```

Again, typescript helps us mock properly:

```typescript
mockedPickFirst("myString");
```

`TS2345: Argument of type '"myString"' is not assignable to parameter of type 'string[]'.`

And also ensures that we don't wrongly used returned values:

```typescript
td.when(mockedPickFirst(["", ""])).thenReturn({ abc: () => {} });
const result = mockedPickFirst(["", ""]);
result.abc();
```

Gives us:
`TS2339: Property 'abc' does not exist on type 'string'.`
