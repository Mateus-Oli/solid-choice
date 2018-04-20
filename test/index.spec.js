'use strict';

const expect = require('chai').expect;
const choose = require('../src');

describe('choose', () => {

  it('injects only "choose" on window object when available', () => {
    global.window = {};
    delete require.cache[require.resolve('../src')];

    const required = require('../src');

    expect(window.choose).to.be.a('function');
    expect(required).to.not.be.a('function');
    expect(Object.keys(window).length).to.be.equal(1);
  });

  it('receives itself on name', () => {
    expect(choose).to.be.equal(choose.choose);
  });

  it('returns choice function', () => {
    expect(choose()).to.be.a('function');
  });

  it('returns undefined when no match', () => {
    expect(choose()()).to.be.equal(undefined);
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

  it('returns non function implementation', () => {
    expect(choose([
      [() => true, 'match']
    ])()).to.be.equal('match');
  });

  it('accepts rest of arguments', () => {
    const choice = choose([[() => true, (x, y, z, other) => {
      expect(x).to.be.equal(1);
      expect(y).to.be.equal(2);
      expect(z).to.be.equal(3);

      expect(other).to.be.equal(undefined);
    }]]);

    choice(1, 2, 3);
  });

  describe('choose.is', () => {

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

  describe('choose.type', () => {
    it('checks typeof value', () => {

      expect(choose.type('string')('')).to.be.equal(true);
      expect(choose.type('number')(0)).to.be.equal(true);
      expect(choose.type('boolean')(false)).to.be.equal(true);
      expect(choose.type('object')({})).to.be.equal(true);
      expect(choose.type('function')(() => { })).to.be.equal(true);
      expect(choose.type('undefined')()).to.be.equal(true);
    });
  });

  describe('choose.empty', () => {

    it('returns true for undefined and null', () => {
      expect(choose.empty()(undefined)).to.equal(true);
      expect(choose.empty()(null)).to.equal(true);
    });

    it('returns false for any other value', () => {
      expect(choose.empty()(0)).to.be.equal(false);
      expect(choose.empty()(NaN)).to.be.equal(false);
      expect(choose.empty()(false)).to.be.equal(false);
      expect(choose.empty()('')).to.be.equal(false);

      expect(choose.empty()(1)).to.be.equal(false);
      expect(choose.empty()('')).to.be.equal(false);
      expect(choose.empty()(true)).to.be.equal(false);
      expect(choose.empty()({})).to.be.equal(false);
    });
  });

  describe('choose.any', () => {

    it('returns true', () => {
      expect(choose.any()()).to.be.equal(true);
    });
  });

  describe('choose.not', () => {

    it('negates result of passed function', () => {
      expect(choose.not(() => true)()).to.be.equal(false);
      expect(choose.not(() => false)()).to.be.equal(true);
    });

    it('executes with passed argument', () => {
      choose.not(x => expect(x).to.be.equal('arg'))('arg');
    });
  });

  describe('choose.and', () => {
    it('returns true for only valid rules', () => {
      expect(choose.and([() => true, () => true])()).to.be.equal(true);
    });
    it('returns false for at least 1 invalid rule', () => {
      expect(choose.and([() => true, () => false])()).to.be.equal(false);
    });
  });

  describe('choose.or', () => {
    it('returns true for at least 1 valid rule', () => {
      expect(choose.or([() => true, () => false])()).to.be.equal(true);
    });

    it('returns false for only invalid rules', () => {
      expect(choose.or([() => false, () => false])()).to.be.equal(false);
    });
  });

  describe('choose().where', () => {

    it('adds new condition', () => {
      const choice = choose([]);
      choice.where({ fromWhere: true }, () => 'fromWhere');

      expect(choice({ fromWhere: true })).to.be.equal('fromWhere');
    });

    it('adds new condition at the end', () => {
      const choice = choose([[ choose.any(), () => 'notFromWhere' ]]);
      choice.where(choose.any(), () => 'fromWhere');

      expect(choice()).to.be.equal('notFromWhere');
    });

    it('returns original choice function', () => {
      const choice = choose([]);
      expect(choice.where()).to.be.equal(choice);
    });
  });

  describe('choose().def', () => {

    it('executes as last choice', () => {
      const choice = choose();
      let executed = false;

      choice.def(() => executed = true);

      expect(choice()).to.be.equal(true);
      expect(executed).to.be.equal(true);
    });

    it('receives arguments', () => {
      const choice = choose();

      choice.def((x, y, z) => {
        expect(x).to.be.equal(1);
        expect(y).to.be.equal(2);
        expect(z).to.be.equal(3);
      });

      choice(1, 2, 3);
    });

    it('returns original choice function', () => {

      const choice = choose();
      expect(choice.def()).to.be.equal(choice);
    });
  });
});
