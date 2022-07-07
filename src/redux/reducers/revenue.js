import * as Types from '../../constants/ActionType';
let initialState = [];

const revenue = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_REVENUE:
      state = action.data;
      return { ...state };
    default: return { ...state };
  }
};

export default revenue;