import { GOT_USER, GOT_OAUTH_ERROR } from '../actions/user';

export const initialState = {
  userData: {},
  oauthError: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_USER:
      return {
        ...state,
        userData: action.user || {},
      };
    case GOT_OAUTH_ERROR:
      return {
        ...state,
        oauthError: action.errorMessage,
      };
    default:
      return state;
  }
};

export default reducer;
