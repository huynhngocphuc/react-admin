import * as Types from '../../constants/ActionType';
let initialState = [];

const productbestselling = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_BESTSELLING:
      state = action.data;
      return { ...state };
    default: return { ...state };
  }
};

export default productbestselling;