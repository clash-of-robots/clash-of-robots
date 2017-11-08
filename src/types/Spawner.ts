export interface Module {
  exports: any;
};

export interface Runner<FOW, Round, Output> {
  loadScript: (script: string) => Promise<void>;
  execute: (module: Module, fow: FOW, round: Round) => Promise<Output>;
}

type spawn = <FOW, Round, Output>() => Runner<FOW, Round, Output>;

export default spawn;
