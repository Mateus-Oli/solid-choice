function choose(entries) {
  return function choice(obj) {
    for (var index in entries) {
      if (matchObject(entries[index][0], obj)) {
        return asFunc(entries[index][1])(obj);
      }
    }
  };
}

choose.is = function is(constructor) {
  return typeof constructor === 'function'
    ? function isInstance(instance) { return Object(instance) instanceof constructor; }
    : function isPrototype(instance) { return Object.prototype.isPrototypeOf.call(constructor, Object(instance)); };
};

choose.empty = function empty() {
  return function empty(value) {
    return value === null || value === undefined;
  };
};

choose.any = function any() {
  return function any() { return true; };
};

choose.not = function not(func) {
  return function not(value) {
    return !func(value);
  };
};

function matchObject(valid, obj) {
  if (!needDeep(valid, obj)) {
    return matchValue(valid, obj);
  }
  for (var prop in valid) {
    if (!matchObject(valid[prop], obj[prop])) {
      return false;
    }
  }
  return true;
}

function matchValue(valid, value) {
  if (typeof valid !== 'function' || valid === value) {
    return valid === value;
  }
  return !!valid(value);
}

function needDeep(valid, value) {
  return typeof valid === 'object' && typeof value === 'object' && valid !== value && valid !== null && value !== null;
}

function asFunc(func) {
  return typeof func === 'function' ? func : function () { return func; };
}

if (typeof window === 'object') {
  window.choose = choose;
}

if (typeof module === 'object') {
  module.exports = choose;
}
