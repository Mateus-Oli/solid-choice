/* eslint-disable-next-line */
import solidChoice from './index.js';

var window = window || {};
const choose = window.choose || solidChoice;

export default choose;

export const is = choose.is;
export const type = choose.type;

export const empty = choose.empty;
export const any = choose.any;

export const not = choose.not;

export const and = choose.and;
export const or = choose.or;
