/* global describe beforeEach afterEach it */

import { expect } from 'chai';
import { getMe, logout, getOauthError } from './user';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import history from '../history';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe('thunk creators', () => {
  let store;
  let mockAxios;

  const initialState = { user: { userData: {}, oauthError: '' } };

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    store = mockStore(initialState);
  });

  afterEach(() => {
    mockAxios.restore();
    store.clearActions();
  });

  describe('getMe', () => {
    it('eventually dispatches the GOT_USER action', async () => {
      const fakeUser = { email: 'Cody' };
      mockAxios.onGet('/auth/me').replyOnce(200, fakeUser);
      await store.dispatch(getMe());
      const actions = store.getActions();
      expect(actions[0].type).to.be.equal('GOT_USER');
      expect(actions[0].user.userData).to.be.deep.equal(fakeUser);
    });
  });

  describe('logout', () => {
    it('logout: eventually dispatches the GOT_USER action', async () => {
      mockAxios.onPost('/auth/logout').replyOnce(204);
      await store.dispatch(logout());
      const actions = store.getActions();
      expect(actions[0].type).to.be.equal('GOT_USER');
      expect(history.location.pathname).to.be.equal('/login');
    });
  });

  describe('getOauthError', () => {
    it('getOauthError: eventually dispatches the GOT_OAUTH_ERROR action', async () => {
      const errorMessage = 'Uh oh!';
      mockAxios.onGet('/auth/error').replyOnce(200, errorMessage);
      await store.dispatch(getOauthError());
      const actions = store.getActions();
      expect(actions[0].type).to.be.equal('GOT_OAUTH_ERROR');
      expect(history.location.pathname).to.be.equal('/login');
      expect(actions[0].user.oauthError).to.be.equal(errorMessage);
    });
  });
});
