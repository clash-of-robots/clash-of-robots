import Game, { AI, functionSpawner } from "../src/Game";
import { createStore } from "redux";

interface World {}

class SimpleAI extends AI<World, World, void> {
  createFogOfWar(world: World) {
    return world;
  }
}

describe("Simple AI", () => {
  let store;
  let game: Game<World, any>;

  beforeEach(async () => {
    store = () => ({});
    game = new Game(store, functionSpawner as any);
    game.registerAI("simple", () => new SimpleAI());
  });

  it("sdf", async () => {
    const ai = new SimpleAI();
    await game.addAI("simple", 'module.exports = [{type:"TEST"}]');
    await game.run(null);
  });
});
