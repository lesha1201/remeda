import { filter } from './filter';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { take } from './take';

describe('data_first', () => {
  it('map', () => {
    const result = map([1, 2, 3] as const, x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });
  it('map.indexed', () => {
    const result = map.indexed([0, 0, 0] as const, (_, i) => i);
    expect(result).toEqual([0, 1, 2]);
  });
});

describe('data_last', () => {
  it('map', () => {
    const result = pipe(
      [1, 2, 3] as const,
      map(x => x * 2)
    );
    expect(result).toEqual([2, 4, 6]);
  });
  it('map.indexed', () => {
    const result = pipe(
      [0, 0, 0] as const,
      map.indexed((_, i) => i)
    );
    expect(result).toEqual([0, 1, 2]);
  });
});

describe('pipe', () => {
  it('with take', () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3] as const,
      map(x => {
        count();
        return x * 10;
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([10, 20]);
  });

  it('indexed', () => {
    const count = vi.fn();
    const result = pipe(
      [0, 0, 0] as const,
      map.indexed((_, i) => {
        count();
        return i;
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([0, 1]);
  });

  it('indexed: check index and items', () => {
    const indexes1: Array<number> = [];
    const indexes2: Array<number> = [];
    const anyItems1: Array<Array<number>> = [];
    const anyItems2: Array<Array<number>> = [];
    const result = pipe(
      [1, 2, 3, 4, 5] as const,
      map.indexed((x, i, items) => {
        anyItems1.push([...items]);
        indexes1.push(i);
        return x;
      }),
      filter(x => x % 2 === 1),
      map.indexed((x, i, items) => {
        anyItems2.push([...items]);
        indexes2.push(i);
        return x;
      })
    );
    expect(result).toEqual([1, 3, 5]);
    expect(indexes1).toEqual([0, 1, 2, 3, 4]);
    expect(indexes2).toEqual([0, 1, 2]);
    expect(anyItems1).toEqual([
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5],
    ]);
    expect(anyItems2).toEqual([[1], [1, 3], [1, 3, 5]]);
  });
});

describe('Strict', () => {
  it('number array', () => {
    const input: Array<number> = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('readonly number array', () => {
    const input: ReadonlyArray<number> = [1, 2, 3] as const;
    const result = map.strict(input, x => x + 1);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('number 3-tuple', () => {
    const input: [number, number, number] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('readonly number 3-tuple', () => {
    const input: readonly [number, number, number] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('named number 3-tuple', () => {
    const input: [item1: number, item2: number, item3: number] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    // There's no way to test this, but notice that the names are copied to the
    // output here...
    expectTypeOf(result).toEqualTypeOf<
      [item1: number, item2: number, item3: number]
    >();
    expect(result).toEqual([2, 3, 4]);
  });

  it('mixed type tuple', () => {
    const input: [number, string, boolean] = [1, '2', true];
    const result = map.strict(input, () => 1);
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([1, 1, 1]);
  });

  it('readonly mixed type tuple', () => {
    const input: readonly [number, string, boolean] = [1, '2', true];
    const result = map.strict(input, () => 1);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([1, 1, 1]);
  });

  it('nonempty (tail) number array', () => {
    const input: [number, ...Array<number>] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('nonempty (tail) readonly number array', () => {
    const input: readonly [number, ...Array<number>] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('nonempty (head) number array', () => {
    const input: [...Array<number>, number] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('nonempty readonly (head) number array', () => {
    const input: readonly [...Array<number>, number] = [1, 2, 3];
    const result = map.strict(input, x => x + 1);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it('complex variadic number array', () => {
    const input: [
      ...Array<'hello'>,
      'world',
      ...Array<number>,
      string,
      ...Array<number>,
      boolean,
    ] = ['hello', 'world', 1, 'testing', 'testing', 'testing', 123, true];
    const result = map.strict(input, identity);
    expectTypeOf(result).toEqualTypeOf<
      [...Array<string | number | boolean>, string | number | boolean]
    >();
    expect(result).toEqual(input);
  });
});

describe('Strict Indexed', () => {
  it('number array', () => {
    const input: Array<number> = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('readonly number array', () => {
    const input: ReadonlyArray<number> = [1, 2, 3] as const;
    const result = map.strict.indexed(input, (x, index) => x + index);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('number 3-tuple', () => {
    const input: [number, number, number] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('readonly number 3-tuple', () => {
    const input: readonly [number, number, number] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('named number 3-tuple', () => {
    const input: [item1: number, item2: number, item3: number] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    // There's no way to test this, but notice that the names are copied to the
    // output here...
    expectTypeOf(result).toEqualTypeOf<
      [item1: number, item2: number, item3: number]
    >();
    expect(result).toEqual([1, 3, 5]);
  });

  it('mixed type tuple', () => {
    const input: [number, string, boolean] = [1, '2', true];
    const result = map.strict.indexed(input, (_, index) => index);
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([0, 1, 2]);
  });

  it('readonly mixed type tuple', () => {
    const input: readonly [number, string, boolean] = [1, '2', true];
    const result = map.strict.indexed(input, (_, index) => index);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    expect(result).toEqual([0, 1, 2]);
  });

  it('nonempty (tail) number array', () => {
    const input: [number, ...Array<number>] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('nonempty (tail) readonly number array', () => {
    const input: readonly [number, ...Array<number>] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('nonempty (head) number array', () => {
    const input: [...Array<number>, number] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('nonempty readonly (head) number array', () => {
    const input: readonly [...Array<number>, number] = [1, 2, 3];
    const result = map.strict.indexed(input, (x, index) => x + index);
    // readonlyness is stripped
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
    expect(result).toEqual([1, 3, 5]);
  });

  it('complex variadic number array', () => {
    const input: [
      ...Array<'hello'>,
      'world',
      ...Array<number>,
      string,
      ...Array<number>,
      boolean,
    ] = ['hello', 'world', 1, 'testing', 'testing', 'testing', 123, true];
    const result = map.strict.indexed(input, identity);
    expectTypeOf(result).toEqualTypeOf<
      [...Array<string | number | boolean>, string | number | boolean]
    >();
    expect(result).toEqual(input);
  });
});
