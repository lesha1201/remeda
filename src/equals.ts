import { purry } from './purry';

// from https://github.com/epoberezkin/fast-deep-equal/blob/master/index.js
const isArray = Array.isArray;
const keyList = Object.keys;

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 * @param a the first object to compare
 * @param b the second object to compare
 * @signature
 *    R.equals(a, b)
 * @example
 *    R.equals(1, 1) //=> true
 *    R.equals(1, '1') //=> false
 *    R.equals([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Object
 */
export function equals(a: unknown, b: unknown): boolean;

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 * @param a the first object to compare
 * @param b the second object to compare
 * @signature
 *    R.equals(b)(a)
 * @example
 *    R.equals(1)(1) //=> true
 *    R.equals('1')(1) //=> false
 *    R.equals([1, 2, 3])([1, 2, 3]) //=> true
 * @dataLast
 * @category Object
 */
export function equals(a: unknown): (b: unknown) => boolean;

export function equals() {
  return purry(_equals, arguments);
}

function _equals(a: unknown, b: unknown) {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const arrA = isArray(a);
    const arrB = isArray(b);
    let i;
    let length;
    let key;

    if (arrA && arrB) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }

    if (arrA !== arrB) {
      return false;
    }

    const dateA = a instanceof Date;
    const dateB = b instanceof Date;
    if (dateA !== dateB) {
      return false;
    }
    if (dateA && dateB) {
      return a.getTime() === b.getTime();
    }

    const regexpA = a instanceof RegExp;
    const regexpB = b instanceof RegExp;
    if (regexpA !== regexpB) {
      return false;
    }
    if (regexpA && regexpB) {
      return a.toString() === b.toString();
    }

    const keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) {
      return false;
    }

    for (i = length; i-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]!)) {
        return false;
      }
    }

    for (i = length; i-- !== 0; ) {
      key = keys[i]!;
      // @ts-expect-error [ts7053] - There's no easy way to tell typescript these keys are safe.
      if (!equals(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
}
