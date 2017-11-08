/** @format */

import Game, { AI, addAI, takeTurn, reset, functionSpawner } from '../src/Game';
import { createStore } from 'redux';
import { expect } from 'chai';

type World = number;
interface Round {
  increment: boolean;
}

const reducer = (state = 0, action: any) => {
  switch (action.type) {
    case 'SET_VALUE':
      return action.payload;
    default:
      return state;
  }
};

const api = {
  addNumbers: (a: number, b: number) => a + b,
};

describe('simple AI', () => {
  let game: Game<World, Round>;

  beforeEach(async () => {
    game = new Game(reducer);
    game.registerSpawner('javascript-function', functionSpawner(api));
  });

  it('should be able to use the provided API', async () => {
    await game.store.dispatch(
      addAI(
        'simple',
        `
          module.exports = [{type:"SET_VALUE", payload: addNumbers(5, 10)}]
        `,
      ),
    );
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState()).to.be.eql({
      ais: {
        types: ['simple'],
        winner: undefined,
      },
      game: 15,
    });
  });
});
