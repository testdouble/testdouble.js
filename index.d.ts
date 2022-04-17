export as namespace testdouble;

//
// types and interfaces
// ----------------------------------------------------------------------------

export type DoubledObject<T> = T;

export type DoubledObjectWithKey<T extends string> = { [K in T]: any };

export type TestDouble<T> = T;

export type TestDoubleConstructor<T> = Constructor<T>;

interface Call {
  context: {};
  args: any[];
}

interface Constructor<T> {
  new (...args: any[]): T;
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
  isTestDouble: boolean;
}

export interface MatcherConfig {
  matches(matcherArgs: any[], actual: any): boolean;
  name?: string | ((matcherArgs: any[]) => string);
  onCreate?(matcherInstance: any, matcherArgs: any[]): void;
  afterSatisfaction?(matcherArgs: any[], actual: any): void;
}

export interface Matchers {
  anything(): any;
  isA(type: Function): any;
  contains(a: string | any[] | {}): any;
  argThat(matcher: Function): any;
  not(v: any): any;
  captor(): Captor;
  create(config: MatcherConfig): any;
}

export const matchers: Matchers;

export interface Stubber<D, R = D extends object ? Partial<D> : D> {
  thenReturn<T>(first: R, ...args: Array<R>): TestDouble<T>;
  thenDo<T>(f: Function): TestDouble<T>;
  thenThrow<T>(e: Error): TestDouble<T>;
  thenResolve<T>(first: R, ...args: Array<R>): TestDouble<T>;
  thenReject<T>(e: Error): TestDouble<T>;
  thenCallback<T>(error: any, data: any): TestDouble<T>;
}

export interface PromiseStubber<P, R = P extends object ? Partial<P> : P> {
  thenReturn<T>(first: Promise<R>, ...args: Array<Promise<R>>): TestDouble<T>;
  thenResolve<T>(first: R, ...args: Array<R>): TestDouble<T>;
  thenDo<T>(f: Function): TestDouble<T>;
  thenReject<T>(e: Error): TestDouble<T>;
}

export interface TestdoubleConfig {
  promiseConstructor?: any;
  ignoreWarnings?: boolean;
  suppressErrors?: boolean;
}

export interface VerificationConfig {
  ignoreExtraArgs?: boolean;
  times?: number;
  cloneArgs?: boolean;
}

export interface WhenConfig {
  ignoreExtraArgs?: boolean;
  times?: number;
  cloneArgs?: boolean;
  defer?: boolean;
  delay?: number;
}

//
// general
// ----------------------------------------------------------------------------

/**
 * Update the configuration. Configuration will perist through the lifetime of
 * of the entire test. If you need to change a configuration property for a
 * single test, you'll need to manage undoing the change yourself (e.g. in
 * beforeEach and afterEach hooks).
 *
 * @export
 * @param {TestdoubleConfig} config
 */
export function config(config: TestdoubleConfig): void;

/**
 * Reset the state.
 *
 * @export
 */
export function reset(): void;

/**
 * Takes a test double function as an argument and will describe the current
 * configuration and state of the test double.
 *
 * @export
 * @template T
 * @param {TestDouble<T>} f
 * @returns {Explanation}
 */
export function explain<T>(f: TestDouble<T>): Explanation;

//
// fake: constructors
// ----------------------------------------------------------------------------

/**
 * Create a fake object constructor the given class.
 *
 * @export
 * @template T
 * @param {{ new (...args: any[]): T }} constructor
 * @returns {DoubledObject<T>}
 */
export function constructor<T>(
  constructor: Constructor<T>
): TestDoubleConstructor<T>;

//
// fake: instance objects
//

/**
 * Construct an instance of a faked class.
 *
 * @export
 * @template T
 * @param {{ new (...args: any[]): T }} constructor
 * @returns {DoubledObject<typeof T>}
 */
export function instance<T>(
  constructor: Constructor<T>
): DoubledObject<T>;


//
// fake: functions
// ----------------------------------------------------------------------------

/**
 * Create a fake function.
 *
 * @param {string} [name] Name of function for better messages.
 * @returns {TestDouble<Function>}
 */
declare function functionDouble(name?: string): TestDouble<Function>;

/**
 * Create a fake function. Typed when type is provided.
 * @example td.func<MyType>();
 * @template T
 * @param {T} [name] Name of function to copy.
 * @returns {TestDouble<T>}
 */
declare function functionDouble<T>(name?: T): TestDouble<T>;

export { functionDouble as function };
export { functionDouble as func };

//
// fake: objects
// ----------------------------------------------------------------------------

/**
 * Create a fake object that is deep copy of the given object.
 *
 * @export
 * @template T
 * @param {{ new (...args: any[]): T }} constructor
 * @returns {DoubledObject<T>}
 */
export function object<T>(constructor: Constructor<T>): DoubledObject<T>;

/**
 * Create a fake object that has the given list of properties.
 *
 * @export
 * @template Key
 * @param {Key[]} props Array of properties.
 * @returns {DoubledObjectWithKey<Key>}
 */
export function object<T extends string>(props: T[]): DoubledObjectWithKey<T>;

/**
 * Create a fake empty object that is cast as the generic using a Proxy object.
 *
 * @export
 * @template T
 * @param {T} object Name of object.
 * @returns {DoubledObject<T>}
 */
export function object<T>(object: string): DoubledObject<T>;

/**
 * Create a fake empty object using a Proxy object that is cast as the generic of a passed interface.
 *
 * @export
 * @template T
 * @returns {DoubledObject<T>}
 */
export function object<T>(): DoubledObject<T>;

/**
 * Create a fake object that is deep copy of the given object.
 *
 * @export
 * @template T
 * @param {T} object Object to copy.
 * @returns {DoubledObject<T>}
 */
export function object<T>(object: T): DoubledObject<T>;

// fake: imitations

/**
 * Create a fake object constructor for the given class.
 *
 * @export
 * @template T
 * @param {{ new (...args: any[]): T }} constructor
 * @param {string} [name]
 * @returns {TestDoubleConstructor<T>}
 */
export function imitate<T>(
  constructor: Constructor<T>,
  name?: string
): TestDoubleConstructor<T>;

/**
 * Create a fake object or function.
 *
 * @export
 * @template T
 * @param {T} original
 * @param {string} [name]
 * @returns {TestDouble<T>}
 */
export function imitate<T>(original: T, name?: string): TestDouble<T>;

//
// stubbing
// ----------------------------------------------------------------------------

/**
 * Callback marker.
 *
 * @export
 * @param {...any[]} args
 */
export function callback(...args: any[]): void;

/**
 * Swap out real dependencies with fake one. Intercept calls to `require`
 * that dependency module and ensure your subject is handed a fake instead.
 *
 * @export
 * @param {string} path
 * @param {*} [f]
 * @returns {*}
 */
export function replace(path: string, f?: any): any;
/**
 * Swap out real dependencies with fake one. Intercept calls to `require`
 * that dependency module and ensure your subject is handed a fake instead.
 *
 * @export
 * @param {string} path
 * @param {*} [f]
 * @returns {*}
 */
export function replaceCjs(path: string, f?: any): any;
/**
 * Swap out real dependencies with fake one. Intercept calls to `import`
 * that dependency module and ensure your subject is handed a fake instead.
 *
 * @export
 * @param {string} path
 * @param {*} [namedExportStubs]
 * @param {*} [defaultExportStub]
 * @returns {Promise<{default?: any, [namedExport: string]: any}>}
 */
export function replaceEsm(path: string, namedExportStubs?: any, defaultExportStub?: any):
  Promise<{default?: any, [namedExport: string]: any}>;

/**
 * Swap out real dependencies with fake one. Reference to the property will
 * be replace it during your test.
 *
 * @export
 * @param {{}} path
 * @param {string} property
 * @param {*} [f]
 * @returns {*}
 */
export function replace(path: {}, property: string, f?: any): any;

/**
 * Stub a specific function call.
 *
 * @export
 * @param {...any[]} args
 * @returns {Stubber}
 */
export function when<P>(f: Promise<P>, config?: WhenConfig): PromiseStubber<P>;
export function when<D>(f: D, config?: WhenConfig): Stubber<D>;
/**
 * Verify a specific function call to a stubbed function.
 *
 * @export
 * @param {...any[]} args
 * @returns {Stubber}
 */
export function verify(a: any, check?: VerificationConfig): void;
