# Solid Choice

[![NPM](https://nodei.co/npm/solid-choice.png)](https://nodei.co/npm/solid-choice/)

[![Build Status](https://travis-ci.org/Mateus-Oli/solid-choice.svg?branch=master)](https://travis-ci.org/Mateus-Oli/solid-choice)
[![Maintainability](https://api.codeclimate.com/v1/badges/2b0ca076f3bc647b03fa/maintainability)](https://codeclimate.com/github/Mateus-Oli/solid-choice/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2b0ca076f3bc647b03fa/test_coverage)](https://codeclimate.com/github/Mateus-Oli/solid-choice/test_coverage)

Pattern match execution for JavaScript

## Basic Usage
```javascript
import choose from 'solid-choice';

const choice = choose([
  [{ object: { value: 'match' } }, object => 'object match'],
  [string => string === 'valid', string => 'validation function match'],
  [{ valid: v => v === 'valid', str: 'str' }, object => 'multiple type match']
]);

choice({ object: { value: 'match' } })// 'object match';
choice('valid')// 'validation function match';
choice({ valid: 'valid', str: 'str' })// 'multiple type match';
choice('invalid')// undefined;
```
