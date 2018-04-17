(function (exports) {
  'use strict';

  exports('choose', choose);

  function choose(entries) {
    return function choice(obj) {
      return findMatch(entries, obj).apply(this, arguments);
    };
  }

  choose.is = function is(constructor) {
    return typeof constructor === 'function'
      ? function isInstance(instance) { return Object(instance) instanceof constructor; }
      : function isPrototype(instance) { return Object.prototype.isPrototypeOf.call(constructor, Object(instance)); };
  };

  choose.type = function type(strType) {
    return function type(value) {
      return strType === typeof value;
    };
  };

  choose.empty = function empty() {
    return function empty(value) {
      return value === null || value === undefined;
    };
  };

  choose.any = function any() {
    return function any() {
      return true;
    };
  };

  choose.not = function not(func) {
    return function not(value) {
      return !func(value);
    };
  };

  choose.and = function and(rules) {
    return function and(value) {
      for (var index in rules) {
        if (!match(rules[index], value)) {
          return false;
        }
      }
      return true;
    };
  };

  choose.or = function or(rules) {
    return function and(value) {
      for (var index in rules) {
        if (match(rules[index], value)) {
          return true;
        }
      }
      return false;
    };
  };

  function findMatch(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (match(arr[i][0], value)) {
        return func(arr[i][1]);
      }
    }
    return Function.prototype;
  }

  function match(rule, obj) {
    return needDeep(rule, obj) ? matchObject(rule, obj) : matchValue(rule, obj);
  }

  function matchObject(rule, obj) {
    for (var prop in rule) {
      if (!match(rule[prop], obj[prop])) {
        return false;
      }
    }
    return true;
  }

  function matchValue(rule, value) {
    return typeof rule === 'function' ? !!rule(value) : rule === value;
  }

  function needDeep(rule, value) {
    return typeof rule === 'object' && typeof value === 'object' && rule !== value && rule !== null && value !== null;
  }

  function func(f) {
    return typeof f === 'function' ? f : function() { return f; };
  }

})(function exports(key, value) {
  return typeof window !== 'undefined'
    ? (window[key] = value)
    : (module.exports = value);
});
