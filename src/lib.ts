/** @format */

import Game, {
  AI,
  addAI,
  takeTurn,
  reset,
  combineReducers,
  functionSpawner,
} from '../src/Game';

(Game as any).AI = AI;
(Game as any).addAI = addAI;
(Game as any).takeTurn = takeTurn;
(Game as any).reset = reset;
(Game as any).combineReducers = combineReducers;
(Game as any).functionSpawner = functionSpawner;

module.exports = Game;
