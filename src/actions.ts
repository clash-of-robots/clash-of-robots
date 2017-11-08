export const takeTurn = (round: any) => ({
  type: "@@COR//TAKE_TURN",
  payload: round
});

export const addAI = (ai: any, script: string) => ({
  type: "@@COR//ADD_AI",
  payload: {
    ai,
    script
  }
});
