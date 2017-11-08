/** @format */

import spawner, { Runner } from '../types/Spawner';

class AI<World, FOW, Round> {
  private _runner: Runner<FOW, Round, any>;

  id: string;
  type: string;

  async load(script: string, spawner: spawner) {
    this._runner = spawner();
    await this._runner.loadScript(script);
  }

  protected createFogOfWar(world: World, round: Round): FOW {
    return (world as Object) as FOW;
  }

  protected validate(
    output: any,
    fogOfWar: FOW,
    world: World,
    round: Round,
  ): undefined | Error[] {
    return undefined;
  }

  async _run(world: World, round: Round) {
    const fog = this.createFogOfWar(world, round);
    const output = await this._runner.execute(fog, round);
    const errors = this.validate(output, fog, world, round);
    return output;
  }
}

export default AI;
