// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Typescript requires using `any` to infer any kind of function type, `unknown` is not enough.
export const _toSingle = <Func extends (...args: any) => unknown>(fn: Func) =>
  Object.assign(fn, { single: true as const });
