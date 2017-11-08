/** @format */

import Game, { AI, addAI, takeTurn, reset } from '../src/Game';
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

  it('should be reset afer a few rounds', async () => {
    await game.store.dispatch(
      addAI(
        'simple',
        `
          module.exports = [{type:"INCREMENT"}]
        `,
      ),
    );
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState()).to.be.eql({
      ais: {
        types: ['simple'],
        winner: undefined,
      },
      game: 1,
    });
    expect(game.aiCount).to.be.equal(1);
    await game.store.dispatch(takeTurn(null));
    expect(game.store.getState().game).to.be.eql(2);

    await game.store.dispatch(reset());
    expect(game.store.getState().game).to.be.eql(0);
    expect(game.aiCount).to.be.equal(1);

    await game.store.dispatch(reset(true));
    expect(game.store.getState().game).to.be.eql(0);
    expect(game.aiCount).to.be.equal(0);
  });
});
