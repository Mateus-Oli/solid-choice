# Solid Choice

[![NPM](https://nodei.co/npm/solid-choice.png)](https://nodei.co/npm/solid-choice/)

[![Build Status](https://travis-ci.org/Mateus-Oli/solid-choice.svg?branch=master)](https://travis-ci.org/Mateus-Oli/solid-choice)
[![Maintainability](https://api.codeclimate.com/v1/badges/2b0ca076f3bc647b03fa/maintainability)](https://codeclimate.com/github/Mateus-Oli/solid-choice/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2b0ca076f3bc647b03fa/test_coverage)](https://codeclimate.com/github/Mateus-Oli/solid-choice/test_coverage)

Pattern match execution for JavaScript

1. [Install](#install)
1. [Import](#import)
1. [Usage](#usage)
1. [Helper](#helper)

## Install
```sh
$ npm i solid-choice
```

## Import

### Browser
```html
<!-- Instaled: --><script src="node_modules/solid-choice/src/index.js"></script>
<!-- CDN(unpkg): --><script src="https://unpkg.com/solid-choice"></script>
```

### CommonJS
```javascript
const choose = require('solid-choice');
```

### ES6 Modules
```javascript
import choose from 'solid-choice';
```

## Usage
```javascript
import choose from 'solid-choice';

const choice = choose([
  [{ object: { value: 'match' } }, object => 'object match'],
  [string => string === 'valid', string => 'validation function match'],
  [{ valid: v => v === 'valid', str: 'str' }, object => 'multiple type match']
]);

choice({ object: { value: 'match' } }); // 'object match'
choice('valid'); // 'validation function match'
choice({ valid: 'valid', str: 'str' }); // 'multiple type match'
choice('invalid'); // undefined
choice(3); // 'is match'
```

## Helpers
```javascript
import choose from 'solid-choice';

const choice = choose([
  [choose.empty(), () => 'undefined or null'],
  [choose.is(Number), () => 'number'],
  [choose.not(choose.is(String)), () => 'not string'],
  [choose.any(), () => 'any non matched value']
]);

choice(null);// 'undefined or null'
choice(3);// 'number'
choice({});// 'not string'
choice('str');// 'any non matched value'
```
