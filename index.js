"use strict";

class PriorityEventChain {
  constructor() {
    this.chains = {};
    this.events = new Set();
  }

  setFirst(name, callback, ctx) {
    return this.subscribe(name, Number.MIN_SAFE_INTEGER, callback, ctx);
  }

  setLast(name, callback, ctx) {
    return this.subscribe(name, Number.MAX_SAFE_INTEGER, callback, ctx);
  }

  subscribe(name, priority, callback, ctx) {
    let sub = {priority, callback, ctx};
    if (!this.events.has(name)) {
      this.events.add(name);
      this.chains[name] = [];
    }
    this.chains[name].push(sub);
    this.chains[name].sort(function (a, b) {
      return a.priority - b.priority;
    });
  }

  unsubscribe(name, callback) {
    if (!this.chains.hasOwnProperty(name)) {
      return;
    }
    for (var idx = 0, l = this.chains[name].length; idx < l; idx++) {
      let sub = this.chains[name][idx];
      if (sub.callback === callback) {
        this.chains[name].splice(idx, 1);
        l--;
        idx--;
      }
    }
    if (this.chains[name].length === 0) {
      delete this.chains[name];
      this.events.delete(name);
    }
  }

  emit(name, event) {
    if (!this.chains.hasOwnProperty(name)) {
      return event;
    }
    for (let idx = 0, l = this.chains[name].length; idx < l; idx++) {
      const sub = this.chains[name][idx];
      let result = sub.callback.call(sub.ctx || this, event);
      if (typeof result === 'undefined') {
        break;
      } else {
        event = result;
      }
    }
    return event;
  }
}

module.exports = PriorityEventChain;
