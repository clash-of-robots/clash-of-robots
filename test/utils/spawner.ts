import { Runner } from '../../src/types/Spawner';

class Spawner<FOW, Round, Output> implements Runner<FOW, Round, Output> {
  fn: any;

  async loadScript(script: string) {
    this.fn = new Function('module', 'world', 'round', script);
  }

  async execute(module: any, fow: FOW, round: Round) {
    const output = await this.fn(module, fow, round) as Output;
    return output;
  };
}

export default () => new Spawner();
