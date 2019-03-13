import { SET_LOADING, UNSET_LOADING } from '../actions/root';

const initialState = {
  loading: { me: false, loginOrSignup: false, oauthError: false },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.loadingType]: true },
      };
    case UNSET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.loadingType]: false },
      };
    default:
      return state;
  }
};
