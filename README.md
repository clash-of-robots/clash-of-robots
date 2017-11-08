# Clash of Robots

[![Build Status](https://travis-ci.org/morten-olsen/clash-of-robots.svg?branch=master)](https://travis-ci.org/morten-olsen/clash-of-robots) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Coverage Status](https://coveralls.io/repos/github/morten-olsen/clash-of-robots/badge.svg?branch=master)](https://coveralls.io/github/morten-olsen/clash-of-robots?branch=master)

A simple engine for creating AI vs. AI games

## Getting started

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
