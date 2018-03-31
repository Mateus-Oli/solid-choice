type match<T> = ((value: T) => any) | {[k in keyof T]: match<T[k]> } | T;

interface Choose {
  <T, R = any>(entries: [match<T>, (value: T) => R][]): (value: T) => R;

  is<T>(constructor: new (...args: any[]) => T): (value: any) => value is T;
  is(prototype: object): (value: any) => boolean;
}

declare const choose: Choose;
export default choose;
