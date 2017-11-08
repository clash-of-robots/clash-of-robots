/** @format */

export default (reducer: any) => (state: any, action: any) => {
  if (action.type === '@@COR//RESET') {
    return reducer(undefined, action);
  } else {
    return reducer(state, action);
  }
};
