/** @format */

import Game, { AI, addAI, takeTurn } from '../src/Game';
import { createStore } from 'redux';
import { expect } from 'chai';

type World = number;
interface Round {
  increment: boolean;
}

const reducer = (state = 0, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

describe('simple AI', () => {
  let game: Game<World, Round>;

  beforeEach(async () => {
    game = new Game(reducer);
  });

  it('should be able to run a few rounds', async () => {
    await game.store.dispatch(
      addAI(
        'simple',
        `
          module.exports = [round.increment ? {type:"INCREMENT"} : {type:"DECREMENT"}]
        `,
      ),
    );
    await game.store.dispatch(takeTurn({ increment: true }));
    expect(game.store.getState()).to.be.eql({
      ais: {
        types: ['simple'],
        winner: undefined,
      },
      game: 1,
    });
    await game.store.dispatch(takeTurn({ increment: true }));
    expect(game.store.getState().game).to.be.eql(2);

    await game.store.dispatch(takeTurn({ increment: false }));
    expect(game.store.getState().game).to.be.eql(1);
  });
});
