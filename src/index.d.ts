type match<T> = ((value: T) => any) | T | (new () => T);
export default function choose<T, R = any>(entries: [match<T>, (value: T) => R][]): R;
