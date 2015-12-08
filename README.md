# Priority Chain

With Priority-Chain, you can emit events in order of priorty, allowing each subscriber to mutate the value.

![npm i priority-chain](https://nodei.co/npm/priority-chain.png)

## Example

```js
'use strict';
const PriorityChain = require('priority-chain');

destiny = {};

const chain = new PriorityChain();

function timesTwo (event) {
  return event * 2;
}

function blocker (event) {
  return;
}

chain.subscribe('set', 10, timesTwo);

chain.subscribe('set', 0, (event) => {
  return event + 8;
});


chain.setLast('set', function (event) {
  this.out = event;
  return event;
}, destiny);

chain.setFirst('set', (event) => {
  return 0;
});

console.log(chain.emit('set', 123)); // 16

chain.subscribe('set', 5, blocker);

console.log(chain.emit('set', 34)); // 8

chain.unsubscribe('set', blocker);

console.log(chain.emit('set', 123)); // 16

chain.unsubscribe('set', timesTwo);

console.log(chain.emit('set', 123)); // 8

chain.setLast('set', function (event) {
  this.output = event;
  return event;
}, destiny);

console.log(chain.emit('set', 123)); // 8
console.log(destiny.output); // 8
```

## Usage

__subscribe__(name, priority, function, ctx)

__unsubscribe__(name, function)

__setFirst__(name, function, ctx)

__setLast__(name, function, ctx)

__emit__(name, event)

If you return nothing or `undefined`, the event blocks the rest of the chain.
