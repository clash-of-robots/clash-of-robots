/** @format */

import Game, { AI, addAI, takeTurn } from '../src/Game';
import { createStore } from 'redux';
import { expect } from 'chai';

type World = number;

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

const findWinner = (world: World) => {
  if (world === 5) {
    return true;
  }
};

describe('simple AI', () => {
  let game: Game<World, any>;

  beforeEach(async () => {
    game = new Game(reducer, {
      findWinner,
    });
  });

  it('should win after 5 rounds', async () => {
    await game.store.dispatch(
      addAI(
        'simple',
        `
          module.exports = [{type:"INCREMENT"}]
        `,
      ),
    );
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState().ais.winner).to.be.eql(undefined);
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState().ais.winner).to.be.eql(undefined);
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState().ais.winner).to.be.eql(undefined);
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState().ais.winner).to.be.eql(undefined);
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState().ais.winner).to.be.eql(true);
  });
});
