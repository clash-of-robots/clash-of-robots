/** @format */

import AI from './ai/AI';
import Spawner from './types/Spawner';
import * as uuid from 'uuid';
import reset from './utils/reset';
import {
  createStore,
  Store,
  Action,
  Reducer,
  applyMiddleware,
  combineReducers,
  Middleware,
} from 'redux';
import functionSpawner from './ai/spawner';
import ais from './reducers/ais';

export { default as AI } from './ai/AI';
export { addAI, takeTurn, reset } from './actions';
export { combineReducers } from 'redux';
export { default as functionSpawner } from './ai/spawner';

type StoreType<World> = {
  [name: string]: any;
  game: World;
};

export interface Options<World, Round> {
  defaultSpawner?: string;
  additionalReducers?: { [name: string]: Reducer<any> };
  aiTypes?: { [name: string]: () => AI<World, any, Round> };
  middlewares?: Middleware[];
  findWinner?: (world: World) => any;
}

class Game<World, Round> {
  private _ais: AI<World, any, Round>[] = [];
  private _spawners: { [name: string]: Spawner } = {};
  private _store: Store<StoreType<World>>;
  private _aiTypes: { [id: string]: () => AI<World, any, Round> } = {};
  private _defaultSpawner: string;
  private _findWinner: (world: World) => any;

  constructor(
    reducer: Reducer<World>,
    {
      additionalReducers = {},
      aiTypes = {
        simple: () => new AI(),
      },
      findWinner,
      middlewares = [],
      defaultSpawner = 'javascript-function',
    }: Options<World, Round> = {},
  ) {
    const store = createStore<StoreType<World>>(
      combineReducers({
        game: reset(reducer),
        ais,
        ...additionalReducers,
      }),
      applyMiddleware(this.middleware.bind(this), ...middlewares),
    );
    this._store = store;
    this.registerSpawner('javascript-function', functionSpawner() as any);
    this._defaultSpawner = defaultSpawner;
    this._findWinner = findWinner;
    Object.keys(aiTypes).forEach(name => {
      this.registerAI(name, aiTypes[name]);
    });
  }

  get store() {
    return this._store;
  }

  get aiCount() {
    return this._ais.length;
  }

  middleware(store: Store<World>) {
    return (next: any) => async (action: any) => {
      if (action.type === '@@COR//TAKE_TURN') {
        return this.run(action.payload);
      } else if (action.type === '@@COR//ADD_AI') {
        const ai = await this.addAI(
          action.payload.ai,
          action.payload.script,
          action.payload.spawner,
        );
        return next({
          type: '@@COR//AI_ADDED',
          payload: {
            id: ai.id,
            type: action.payload.ai,
            data: action.payload.data,
          },
        });
      } else {
        if (action.type === '@@COR//RESET' && action.payload.removeAIs) {
          this._ais = [];
        }
        return next(action);
      }
    };
  }

  registerAI(name: string, creator: () => AI<World, any, Round>) {
    this._aiTypes[name] = creator;
    this.store.dispatch({
      type: '@@COR//ADD_AI_TYPE',
      payload: Object.keys(this._aiTypes),
    });
  }

  registerSpawner(name: string, spawner: Spawner) {
    this._spawners[name] = spawner;
  }

  async addAI(type: string, script: string, spawner?: string) {
    const ai = this._aiTypes[type]();
    ai.id = uuid.v4();
    ai.type = type;
    const spawnerName = spawner || this._defaultSpawner;
    await ai.load(script, this._spawners[spawnerName]);
    this._ais.push(ai);
    return ai;
  }

  hasWinner() {
    if (!this._findWinner) return undefined;
    const winner = this._findWinner(this.store.getState().game);
    if (winner) {
      this.store.dispatch({
        type: '@@COR//FOUND_WINNER',
        payload: winner,
      });
    }
  }

  async run(round: Round) {
    for (let ai of this._ais) {
      const state = this.store.getState();
      if (state.ais.winner) {
        return;
      }
      const outputs = await ai._run(this._store.getState().game, round);
      for (let output of outputs) {
        await this._store.dispatch({
          ...(output as any),
          meta: {
            ...(output as any).meta,
            ai: {
              id: ai.id,
              type: ai.type,
            },
          },
        } as any);
        this.hasWinner();
      }
    }
  }
}

export default Game;
