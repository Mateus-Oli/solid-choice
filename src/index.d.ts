type match<T> = ((value: T) => any) | { [k in keyof T]: match<T[k]> } | T;

interface Choice<T, R> {

  (value: T): R;
  (value: T, ...args: any[]): R;

  where(valid: match<T>, choice: (value: T) => R): Choice<T, R>;
}

interface Choose {

  <T, R = any>(entries: [match<T>, (value: T, ...args: any[]) => R][]): Choice<T, R>;

  is<T>(constructor: new (...args: any[]) => T): (value: any) => value is T;
  is(prototype: object): (value: any) => boolean;

  type(type: 'string'): (value: any) => value is string;
  type(type: 'number'): (value: any) => value is number;
  type(type: 'boolean'): (value: any) => value is boolean;
  type(type: 'object'): (value: any) => value is { [k: string]: any };
  type(type: 'function'): (value: any) => value is ((...args: any[]) => any);
  type(type: 'undefined'): (value: any) => value is undefined;

  empty(): (value: any) => value is undefined | null;

  any(): (value: any) => true;

  not<T>(f: (value: T) => true): (value: T) => false;
  not<T>(f: (value: T) => false): (value: T) => true;
  not<T>(f: (value: T) => any): (value: T) => boolean;

  and<T>(rules: ((value: T) => any)[]): (value: T) => boolean;
  or<T>(rules: ((value: T) => any)[]): (value: T) => boolean;
}

declare const choose: Choose;
export default choose;
