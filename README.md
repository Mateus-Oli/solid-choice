# Solid Choice
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
