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

  describe('choose.it', () => {

    it('checks instance for constructors', () => {
      class Class { }

      expect(choose.is(Class)(new Class)).to.be.equal(true);
      expect(choose.is(Class)({})).to.be.equal(false);
    });


    it('checks prototype for objects', () => {
      const obj = {};

      expect(choose.is(obj)(Object.create(obj))).to.be.equal(true);
      expect(choose.is(obj)({})).to.be.equal(false);
    });

    it('accepts primitives', () => {

      expect(choose.is(Number)(3)).to.be.equal(true);
      expect(choose.is(Number.prototype)(4)).to.be.equal(true);
    });

    it('returns false when same', () => {
      const obj = {};

      expect(choose.is(obj)(obj)).to.be.equal(false);
    });
  });
});
