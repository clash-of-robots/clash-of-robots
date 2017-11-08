import AI from "./ai/AI";
import Spawner from "./types/Spawner";
import * as uuid from "uuid";
import { createStore, Store, Action, Reducer, applyMiddleware } from "redux";

export { default as AI } from "./ai/AI";
export { default as functionSpawner } from "./ai/spawner";
export { addAI, takeTurn } from "./actions";

class Game<World, Round> {
  private _ais: AI<World, any, Round>[] = [];
  private _spawner: Spawner;
  private _store: Store<World>;
  private _aiTypes: { [id: string]: () => AI<World, any, Round> } = {};

  constructor(reducer: Reducer<World>, spawner: Spawner) {
    const store = createStore<World>(
      reducer,
      applyMiddleware(this.middleware.bind(this))
    );
    this._store = store;
    this._spawner = spawner;
  }

  get store() {
    return this._store;
  }

  middleware(store: Store<World>) {
    return (next: any) => async (action: any) => {
      if (action.type === "TAKE_TURN") {
        return this.run(action.payload);
      } else if (action.type === "ADD_AI") {
        const ai = await this.addAI(action.payload.ai, action.payload.script);
        return next({
          type: "AI_ADDED",
          payload: {
            id: ai.id,
            type: action.payload.ai,
            data: action.payload.data
          }
        });
      } else {
        return next(action);
      }
    };
  }

  registerAI(name: string, creator: () => AI<World, any, Round>) {
    this._aiTypes[name] = creator;
  }

  async addAI(type: string, script: string) {
    const ai = this._aiTypes[type]();
    ai.id = uuid.v4();
    await ai.load(script, this._spawner);
    this._ais.push(ai);
    return ai;
  }

  async run(round: Round) {
    for (let ai of this._ais) {
      const outputs = await ai._run(this._store.getState(), round);
      for (let output of outputs) {
        await this._store.dispatch(output);
      }
    }
  }
}

export default Game;
