'use strict';

const lab = exports.lab = require('lab').script();
const expect = require('code').expect;
const PriorityChain = require('../index.js');

lab.experiment('PriorityEventChain', () => {

  lab.test('basic chain', (done) => {
    const chain = new PriorityChain();
    let out = 0;
    function addTwo (event) {
      return event + 2;
    }
    chain.subscribe('set', 0, (event) => {
      return event + 1;
    });
    chain.subscribe('set', 1, addTwo);
    chain.setLast('set', (event) => {
      out = event;
      return event;
    });
    chain.setFirst('set', (event) => {
      return 0;
    });
    const result = chain.emit('set', 20);
    expect(result).to.equal(out);
    expect(result).to.equal(3);
    chain.unsubscribe('crap', () => {});
    chain.unsubscribe('set', addTwo);
    const result2 = chain.emit('set', 32);
    expect(result2).to.equal(out);
    expect(result2).to.equal(1);
    done();
  });

  lab.test('remove all', (done) => {
    function addTwo (event) {
      return event + 2;
    }
    const chain = new PriorityChain();
    chain.subscribe('set', 0, addTwo);
    expect(chain.emit('set', 3)).to.equal(5);
    chain.unsubscribe('set', addTwo);
    expect(chain.emit('set', 4)).to.equal(4);
    done();
  });

  lab.test('breaker', (done) => {
    const chain = new PriorityChain();
    chain.subscribe('set', 0, (e) => e + 2);
    chain.subscribe('set', 10, (e) => e * 2);
    expect(chain.emit('set', 4)).to.equal(12);
    chain.subscribe('set', 5, (e) => {});
    expect(chain.emit('set', 4)).to.equal(6);
    done();
  });

  lab.test('context', (done) => {
    const chain = new PriorityChain();
    const out = {};
    chain.subscribe('set', 0, function (e) {
      this.x = e;
      return e + 2;
    }, out);
    expect(chain.emit('set', 4)).to.equal(6);
    expect(out.x).to.equal(4);
    done();
  });

});
