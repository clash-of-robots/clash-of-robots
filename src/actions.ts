export const takeTurn = (round: any) => ({
  type: "TAKE_TURN",
  payload: round
});

export const addAI = (ai: any, script: string) => ({
  type: "ADD_AI",
  payload: {
    ai,
    script
  }
});
