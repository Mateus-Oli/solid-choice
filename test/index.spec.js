global.window = {};

const { expect } = require('chai');
const choose = require('../src');

describe('choose', () => {

  it('injects choose function when window object available', () => {
    expect(choose).to.be.equal(window.choose);
    delete global.window;
  });

  it('returns choice function', () => {
    expect(choose()).to.be.a('function');
  });

  it('returns undefined when no match', () => {
    expect(choose([])()).to.be.equal(undefined);
  });

  it('matchs value when not a function', () => {
    const choice = choose([
      [3, () => '3 match'],
      [{ a: { b: 3 } }, () => 'object match']
    ]);

    expect(choice(3)).to.be.equal('3 match');
    expect(choice({ a: { b: 3 }, c: 10 })).to.be.equal('object match');

    expect(choice({ a: { b: 4 } })).to.be.equal(undefined);
  });

  it('does not match any value with empty object', () => {
    expect(choose([
      [{ value: {} }, () => 'match']
    ])({ value: 3 })).to.be.equal(undefined);
  });

  it('executes matching function', () => {
    let executed = false;

    const choice = choose([
      [() => executed = true, () => { }]
    ]);

    choice();
    expect(executed).to.be.equal(true);
  });

  it('executes functions with arg', () => {
    const obj = {};

    choose([
      [
        x => {
          expect(x).to.be.equal(obj);
          return true;
        },
        x => {
          expect(x).to.be.equal(obj);
        }
      ]
    ])(obj);
  });

  it('executes only first match', () => {
    choose([
      [() => false, () => expect.fail('executed false match', 'does not execute false match')],
      [() => true, () => { }],
      [() => true, () => expect.fail('executed second match', 'executes only first match')]
    ])();
  });


  it('tests readme exemple', () => {
    const choice = choose([
      [{ object: { value: 'match' } }, () => 'object match'],
      [string => string === 'valid', () => 'validation function match'],
      [{ valid: v => v === 'valid', str: 'str' }, () => 'multiple type match']
    ]);

    expect(choice({ object: { value: 'match' } })).to.be.equal('object match');
    expect(choice('valid')).to.be.equal('validation function match');
    expect(choice({ valid: 'valid', str: 'str' })).to.be.equal('multiple type match');
    expect(choice('invalid')).to.be.equal(undefined);
  });
});
