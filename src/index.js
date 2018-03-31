function choose(entries) {
  return function choice(obj) {
    for (var index in entries) {
      if (matchObject(entries[index][0], obj)) {
        return entries[index][1](obj);
      }
    }
  };
}

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

if (typeof window === 'object') {
  window.choose = choose;
}

if (typeof module === 'object') {
  module.exports = choose;
}
