# Clash of Robots

A simple engine for creating AI vs. AI games

[![Build Status](https://travis-ci.org/morten-olsen/clash-of-robots.svg?branch=master)](https://travis-ci.org/morten-olsen/clash-of-robots) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Coverage Status](https://coveralls.io/repos/github/morten-olsen/clash-of-robots/badge.svg?branch=master)](https://coveralls.io/github/morten-olsen/clash-of-robots?branch=master) [![Sauce Test Status](https://saucelabs.com/buildstatus/mortenolsen)](https://saucelabs.com/u/mortenolsen) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![npm](https://img.shields.io/npm/v/clash-of-robots.svg)](https://www.npmjs.com/package/clash-of-robots) [![Known Vulnerabilities](https://snyk.io/test/github/morten-olsen/clash-of-robots/badge.svg)](https://snyk.io/test/github/morten-olsen/clash-of-robots)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/mortenolsen.svg)](https://saucelabs.com/u/mortenolsen)

## Getting started

Warning, there has been no proof reading of this text yet, so while the project should be ready to use, the text describing it is still very much a work in progress

[Playground / Demo](https://codepen.io/morten-olsen/pen/NwbJKZ)

### Install

#### npm / yarn

```bash
npm install clash-of-robots
# or
yarn add clash-of-robots
```

####  Browser/CDN

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/clash-of-robots/dist/clash-of-robots.min.js"></script>
```

### Creating a games

When creating a game only one things is needed, a redux style `reducer`. Other options are available, and will be explained later

```javascript
const { combineReducers } = require('redux');
const ClashOfRobots = require('clash-of-robots');

const counter = (state = 0, action) => {
   switch (action.type) {
     case 'INCREMENT':
       return state.count + 1;
     case 'DECREMENT':
       return state.count - 1;
     case default:
      return state;
   }
};

const reducer = combineReducers({
  counter,
});

const game = new ClashOfRobots(reducer);
```

### Creating AI types

AI types are basically rulesets round the AI script, which controls the _fog of war_ and validated the output of an AI. These are created as extensions to the `AI` class and are registered in the games

Output of AIs are a list of `redux` actions

```javascript
const { AI } = require('clash-of-robots');

class SimpleAI extends AI {
  createFogOfWar(world, round) {
    return world.counter;
  }

  validate(outputs, fow, world, round) {
    for (let output of outputs) {
      if (output.type !== 'INCREMENT' && output.type !== 'DECREMENT') {
        return Error('INVALID ACTION');
      }
    }
  }
}

game.registerAI('simple', () => new SimpleAI());
```

### Running AIs

Now that the AI type is registered, it is time to add some actual AIs into the game engine. The best way to do it is using the underlaying `redux` store, and dispatch an AI action

```javascript
const { addAI } = require('clash-of-robots');

game.store.dispatch(addAI('simple', `
  if (world < 5) {
    return [{ type: 'INCREMENT' }]
  }
`));
```

So the AI above should increment out `world.count` until it hits 5 and then stop.

To run a round, dispatch a `takeTurn` action, which will cycle through all AIs allowing them to take their turn.

```javascript
const { takeTurn } = require('clash-of-robots');

game.store.dispatch(takeTurn());
```

### Winning the game

A win condition can be added to the game to be evaluated after an AI run to determine if an AI has won the game.

This function is supplied to the game as an option and should return an identification for the winner which will then be store in `state.ais.winner`

Once a winner has been found, `takeTurn` will no longer change anything in the world.

```javascript
const findWinner = (world) => {
  if (world === 5) {
    return 'winner';
  }
}

const game = ClashOfRobots(reducer, {
  findWinner,
});
```

### Showing the World

As the store behind the game is a regular `redux` store, all methods apply,  `game.store.subscribe`, `game.store.getState` are both valid, as well as using a library such as `react-redux` for binding to `react` components. Be ware that the game reducer is stored inside `game` in the store

## Advanced topics

### Adding AI api

When using the `javascript-function` spawner it is possible to supply an additional API, which becomes available to the AI script, this is done by registering it as a new spawner, or reregistering

```javascript
const { functionSpawner } = require('crash-of-robots');

const api = {
  addNumbers: (a, b) => a + b,
};

game.registerSpawner('javascript-function', functionSpawner(api));

game.store.dispatch(addAI('simple', `
  module.exports = [{
    type: 'ADD_NUMBERS',
    payload: addNumbers(5, 10),
  }];
`));
```

### Spawners

The game is centered around spawners, which are small units, which get loaded with a code string and then they are responsible for executing that code when invoked. With no modification the spawner used is the `javascript-function` spawner, which simply uses `new Function(...)` to create a function to be called. This however will not be the ideal solution for many cases, for instance, if running on a server, that would give the AI access to all node APIs. Therefore it is a good idea to opt for another spawner.
These are at the moment a work in progress, but the once that I am working on are:

* **fork-vm** - forking a new node process, with the code running inside a VM to protect the system
* **http** - running on an http API, so AI agents can live on completely separate systems
* **tcp** - same as http, just over an TCP socket instead
* **web-worker** - create a new browser tread and then uses postMessage to communicate
* **stdinout** - using a process stdin and stdout to send and receive, which allows for a variety of other languages to act as AIs

And i might create a **web-rtc** if i get the time.

But as the list shows, pretty much anything which can receive and send JSON can act as an agent.

To create a spawner, simply create a method with `loadScript` and `execute`

below is the `javascript-function` for reference

```javascript
class JavascriptFunctionSpawner {
  async loadScript(script) {
    this.fn = new Function('module', 'fow', 'round', script)
  }

  async execute(fow, round) {
    const module = { exports: [] };
    await this.fn(module, fow, round);
    return module.exports;
  }
}

game.registerSpawner('javascript-function', () => new JavascriptFunctionSpawner());

game.store.dispatch(addAI('simple', '...', {
  spawner: 'javascript-function',
}));
```
