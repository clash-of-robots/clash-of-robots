import Game, { AI, addAI, takeTurn } from "../src/Game";
import { createStore } from "redux";

interface World {}

class SimpleAI extends AI<World, World, void> {
  createFogOfWar(world: World) {
    return world;
  }
}

describe("Simple AI", () => {
  let reducer;
  let game: Game<World, any>;

  beforeEach(async () => {
    game = new Game(() => ({}));
    game.registerAI("simple", () => new SimpleAI());
  });

  it("sdf", async () => {
    const ai = new SimpleAI();
    await game.store.dispatch(addAI("simple", 'module.exports = [{type:"TEST"}]'));
    await game.store.dispatch(takeTurn(null));
  });
});
