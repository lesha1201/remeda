import { purry } from './purry';
import { toPairs } from './toPairs';

/**
 * Maps keys of `object` and keeps the same values.
 * @param data the object to map
 * @param fn the mapping function
 * @signature
 *    R.mapKeys(object, fn)
 * @example
 *    R.mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @dataFirst
 * @category Object
 */
export function mapKeys<T, S extends PropertyKey>(
  data: T,
  fn: (key: keyof T, value: Required<T>[keyof T]) => S
): Record<S, T[keyof T]>;

/**
 * Maps keys of `object` and keeps the same values.
 * @param fn the mapping function
 * @signature
 *    R.mapKeys(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @dataLast
 * @category Object
 */
export function mapKeys<T, S extends PropertyKey>(
  fn: (key: keyof T, value: Required<T>[keyof T]) => S
): (data: T) => Record<S, T[keyof T]>;

export function mapKeys() {
  return purry(_mapKeys, arguments);
}

function _mapKeys<T extends object>(
  data: T,
  fn: (key: keyof T, value: Required<T>[keyof T]) => PropertyKey
) {
  const out: Partial<Record<PropertyKey, Required<T>[keyof T]>> = {};
  for (const [key, value] of toPairs.strict(data)) {
    out[fn(key, value)] = value;
  }
  return out;
}
