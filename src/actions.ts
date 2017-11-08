export interface AIOptions {
  spawner?: string;
}

export const takeTurn = <Round>(round: Round) => ({
  type: "@@COR//TAKE_TURN",
  payload: round
});

export const addAI = (ai: any, script: string, {
  spawner
}: AIOptions = {}) => ({
  type: "@@COR//ADD_AI",
  payload: {
    ai,
    script,
    spawner,
  }
});
