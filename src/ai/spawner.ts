/** @format */

import { Runner } from '../types/Spawner';

export class Spawner<FOW, Round, Output> implements Runner<FOW, Round, Output> {
  fn: any;
  api: any;

  constructor(api: any = {}) {
    this.api = api;
  }

  async loadScript(script: string) {
    this.fn = new Function(
      'module',
      ...Object.keys(this.api),
      'world',
      'round',
      script,
    );
  }

  async execute(fow: FOW, round: Round) {
    const module = { exports: [] };
    const apiValues = Object.keys(this.api).map(key => this.api[key]);
    await this.fn(module, ...apiValues, fow, round);
    return (module.exports as Object) as Output;
  }
}

export default (api?: any) => () => new Spawner<any, any, any>(api);
