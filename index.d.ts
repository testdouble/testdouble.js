
//
// types and interfaces
// ----------------------------------------------------------------------------

export type DoubledObject<Subject> = Subject;

export type DoubledObjectWithKey<Key extends string> = {};

export type TestDouble<Function> = Function;

interface Call {
  context: {};
  args: any[];
}

export interface Captor {
  capture(): any;
  value?: any;
  values?: any[];
}

export interface Explanation {
  callCount: number;
  calls: Call[];
  description: string;
}

export interface Matchers {
  anything(): any;
  isA(type: Function): any;
  contains(a: string | any[] | {}): any;
  argThat(matcher: Function): any;
  not(v: any): any;
  captor(): Captor
}

export const matchers: Matchers;

export interface Stubber {
  thenReturn<T>(...args: any[]): TestDouble<T>;
  thenDo<T>(f: Function): TestDouble<T>;
  thenThrow<T>(e: Error): TestDouble<T>;
  thenResolve<T>(v: any): TestDouble<T>;
  thenReject<T>(e: Error): TestDouble<T>;
  thenCallback<T>(...args: any[]): TestDouble<T>;
}

export interface TestdoubleConfig {
  promiseConstructor?: any;
  ignoreWarnings?: boolean;
  suppressErrors?: boolean;
}

export interface VerificationConfig {
  ignoreExtraArgs?: boolean;
  times?: number;
}

//
// general
// ----------------------------------------------------------------------------

export function config(config: TestdoubleConfig): void;

export function reset(): void;

export function explain<T>(f: TestDouble<T>): Explanation;


//
// fake: constructors
// ----------------------------------------------------------------------------

//
// fake: functions
// ----------------------------------------------------------------------------

declare function functionDouble(name?: string): TestDouble<Function>;

declare function functionDouble<T>(name?: T): TestDouble<T>;

export { functionDouble as function };
export { functionDouble as func };

//
// fake: objects
// ----------------------------------------------------------------------------

export function object<T>(constructor: { new (...args: any[]): T }): DoubledObject<T>;

export function object<Key extends string>(props: Key[]): DoubledObjectWithKey<Key>;

export function object<T>(object: string): DoubledObject<T>;

export function object<T>(object: T): DoubledObject<T>;

//
// stubbing
// ----------------------------------------------------------------------------

export function callback(...args: any[]): void;

export function replace(path: string, f?: any): any;

export function replace(path: {}, property: string, f?: any): any;

export function when(...args: any[]): Stubber;

export function verify(a: any, check?: VerificationConfig): void;
