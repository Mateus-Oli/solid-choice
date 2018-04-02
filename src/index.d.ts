type match<T> = ((value: T) => any) | {[k in keyof T]: match<T[k]> } | T;

interface Choose {
  <T, R = any>(entries: [match<T>, (value: T) => R][]): (value: T) => R;

  is<T>(constructor: new (...args: any[]) => T): (value: any) => value is T;
  is(prototype: object): (value: any) => boolean;

  empty<T>(): (x: T) => boolean;
  empty(): (x: null | undefined) => true;

  any<T>(): (x: T) => true;

  not<T>(f: (x: T) => any): (x: T) => boolean;
  not<T>(f: (x: T) => true): (x: T) => false;
  not<T>(f: (x: T) => false): (x: T) => true;
}

declare const choose: Choose;
export default choose;
