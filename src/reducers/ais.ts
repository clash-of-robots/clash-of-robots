/** @format */

const createDefaults = () => ({
  types: [],
  winner: undefined,
});

export default (state = createDefaults(), action: any) => {
  switch (action.type) {
    case '@@COR//ADD_AI_TYPE':
      return {
        ...state,
        types: action.payload,
      };
    case '@@COR//FOUND_WINNER':
      return {
        ...state,
        winner: action.payload,
      };
    default:
      return state;
  }
};
