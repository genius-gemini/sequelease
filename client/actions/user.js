import axios from 'axios';
import { initialState } from '../reducers/user';

export const GOT_USER = 'GOT_USER';
export const GOT_OAUTH_ERROR = 'GOT_OAUTH_ERROR';

const gotMe = user => ({
  type: GOT_USER,
  user,
});

const gotOauthError = errorMessage => ({
  type: GOT_OAUTH_ERROR,
  errorMessage,
});

export const getMe = () => async dispatch => {
  try {
    const result = await axios.get('/auth/me');
    const user = result.data;
    dispatch(gotMe(user));
  } catch (err) {
    console.error(err);
  }
};

export const auth = (formData, method) => async dispatch => {
  try {
    const result = await axios.post(`/auth/${method}`, formData); // method - local sign up or login
    const user = result.data;
    dispatch(gotMe(user));
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.delete('/auth/logout');
    dispatch(gotMe(initialState.userData));
  } catch (err) {
    console.error(err);
  }
};

export const getOauthError = () => async dispatch => {
  try {
    const result = await axios.get('/auth/error');
    const errorMessage = result.data;
    dispatch(gotOauthError(errorMessage));
  } catch (err) {
    console.error(err);
  }
};
