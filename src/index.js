'use strict';

(function main(exports) {
  exports('choose', choose);

  function choose(_entries, last) {
    var entries = _entries || [];

    function choice(obj) {
      return findMatch(entries, obj, last).apply(this, arguments);
    }

    choice.where = function where(valid, value) {
      entries.push([ valid, value ]);
      return choice;
    };

    choice.def = function def(f) {
      last = f;
      return choice;
    };

    return choice;
  }

  choose.is = function is(constructor) {
    return typeof constructor === 'function'
      ? function isInstance(instance) { return Object(instance) instanceof constructor; }
      : function isPrototype(instance) { return Object.prototype.isPrototypeOf.call(constructor, Object(instance)); };
  };

  choose.type = function type(strType) {
    return function type(value) { return strType === typeof value; };
  };

  choose.empty = function empty() {
    return function empty(value) { return value === null || value === undefined; };
  };

  choose.any = function any() {
    return function any() { return true; };
  };

  choose.not = function not(func) {
    return function not(value) { return !func(value); };
  };

  choose.and = function and(rules) {
    return function and(value) { return rules.every(prepareValue(value)); };
  };

  choose.or = function or(rules) {
    return function or(value) { return rules.some(prepareValue(value)); };
  };

  function prepareValue(value) {
    return function matchRule(rule) { return match(rule, value); };
  }

  function findMatch(arr, value, def) {
    for (var i = 0; i < arr.length; i++) {
      if (match(arr[i][0], value)) {
        return func(arr[i][1]);
      }
    }
    return func(def);
  }

  function match(rule, obj) {
    return needDeep(rule, obj) ? matchObject(rule, obj) : matchValue(rule, obj);
  }

  function matchObject(rule, obj) {
    return Object
      .keys(rule)
      .every(function matchProp(key) { return match(rule[key], obj[key]); });
  }

  function matchValue(rule, value) {
    return typeof rule === 'function' ? !!rule(value) : rule === value;
  }

  function needDeep(rule, value) {
    return typeof rule === 'object' && typeof value === 'object' && rule !== value && rule !== null && value !== null;
  }

  function func(f) {
    return typeof f === 'function' ? f : function func() { return f; };
  }

})(function exports(name, pack) {
  pack[name] = pack;
  (typeof window !== 'undefined') && (window[name] = pack);
  (typeof module !== 'undefined') && (module.exports = pack);
});
