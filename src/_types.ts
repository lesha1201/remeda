import type { IsAny } from './type-fest/is-any';

export type Pred<T, K> = (input: T) => K;
export type PredIndexed<T, K> = (input: T, index: number, array: Array<T>) => K;
export type PredIndexedOptional<T, K> = (
  input: T,
  index?: number,
  array?: ReadonlyArray<T>
) => K;

export type NonEmptyArray<T> = [T, ...Array<T>];

/**
 * This should only be used for defining generics which extend any kind of JS
 * array under the hood, this includes arrays *AND* tuples (of the form [x, y],
 * and of the form [x, ...y[]], etc...), and their readonly equivalent. This
 * allows us to be more inclusive to what functions can process.
 *
 * @example map<T extends ArrayLike>(items: T) { ... }
 *
 * We would've named this `ArrayLike`, but that's already used by typescript...
 *
 * @see This was inspired by the type-definition of Promise.all (https://github.com/microsoft/TypeScript/blob/1df5717b120cddd325deab8b0f2b2c3eecaf2b01/src/lib/es2015.promise.d.ts#L21)
 */
export type IterableContainer<T = unknown> = ReadonlyArray<T> | [];

// Inspired and largely copied from `sindresorhus/ts-extras`:
// @see https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-keys.ts
export type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`;

/**
 * Copied verbatim from `sindresorhus/ts-extras` (MIT License).
 * @see https://github.com/sindresorhus/type-fest/blob/main/source/readonly-tuple.d.ts
 */
export type ReadonlyTuple<
  Element,
  Length extends number,
> = number extends Length
  ? // Because `Length extends number` and `number extends Length`, then `Length` is not a specific finite number.
    ReadonlyArray<Element> // It's not fixed length.
  : BuildTupleHelper<Element, Length, []>; // Otherwise it is a fixed length tuple.

/**
 * An extension of Extract for type predicates which falls back to the base
 * in order to narrow the `unknown` case.
 * @example
 *   function isMyType<T>(data: T | MyType): data is NarrowedTo<T, MyType> { ... }
 */
export type NarrowedTo<T, Base> =
  Extract<T, Base> extends never
    ? Base
    : IsAny<T> extends true
      ? Base
      : Extract<T, Base>;

type BuildTupleHelper<
  Element,
  Length extends number,
  Rest extends Array<Element>,
> = Rest['length'] extends Length
  ? readonly [...Rest] // Terminate with readonly array (aka tuple)
  : BuildTupleHelper<Element, Length, [Element, ...Rest]>;

/**
 * A compare function that is compatible with the native `Array.sort` function.
 * @returns >0 if `a` should come after `b`, 0 if they are equal, and <0 if `a` should come before `b`.
 */
export type CompareFunction<T> = (a: T, b: T) => number;

/**
 * Based on type-fest's IsAny
 * @see https://github.com/sindresorhus/type-fest/blob/main/source/is-any.d.ts
 */
export type IfIsAny<T, Then, Else> = 0 extends 1 & T ? Then : Else;
