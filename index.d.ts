export type TestDouble = Function;

export type DoubledObjectWithKey<Key extends string> = {};

export type DoubledObject<Subject> = Subject;

declare function functionDouble(name?: string): TestDouble;
export { functionDouble as function };

// When passed class or constructor function
export function object<T>(constructor: { new (): T }): DoubledObject<T>;

// When passed array of props
export function object<Key extends string>(props: Key[]): DoubledObjectWithKey<Key>;

// When passed general object
export function object<T>(object: T): DoubledObject<T>;

export type Stubber = {
  thenReturn(...args: any[]): TestDouble;
  thenDo(f: Function): TestDouble;
  thenThrow(e: Error): TestDouble;
  thenResolve(v: any): TestDouble;
  thenReject(e: Error): TestDouble;
  thenCallback(...args: any[]): TestDouble;
}

export function callback(...args: any[]): void;

export function when(...args: any[]): Stubber;

export type Matchers = {
  anything(): any;
  isA(type: Function): any;
  contains(a: string|any[]|{}): any;
  argThat(matcher: Function): any;
  not(v: any): any;
};

export const matchers: Matchers;

export function replace(path: string, f?: any): void;
export function replace(path: {}, property: string, f?: any): void;

export function reset(): void;

export type VerificationConfig = {
  ignoreExtraArgs?: boolean;
  times?: number;
};

export function verify(a: any, check?: VerificationConfig): void;

type Call = {
  context: {};
  args: any[];
};

export type Explanation = {
  callCount: number;
  calls: Call[];
  description: string;
}

export function explain(f: TestDouble): Explanation;
