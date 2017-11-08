const createDefaults = () => ({
  types: [],
});

export default (state = createDefaults(), action: any) => {
  switch (action.type) {
    case '@@COR//ADD_AI_TYPE':
      return {
        ...state,
        types: action.payload,
      }
    default:
      return state;
  }
};
