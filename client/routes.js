import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Login, Signup } from './components';
import { getMe, getOauthError } from './actions/user';
import { setLoading, unsetLoading } from './actions/root';

/**
 * COMPONENT
 */

class Routes extends Component {
  componentDidMount() {
    const { loadInitialData, loadOauthError } = this.props;

    loadInitialData();

    if ('/login' === location.pathname) {
      loadOauthError();
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const { isLoggedIn, loading } = this.props;

    return (
      <div>
        {loading.me || loading.oauthError ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Switch>
              {isLoggedIn && (
                <Switch>
                  {['/login', '/signup', '/'].includes(location.pathname) && (
                    <Redirect to="/home" />
                  )}

                  {/*<Route path="/login" component={UserHome} />
                  <Route path="/signup" component={UserHome} />*/}
                  <Route path="/home" component={UserHome} />
                </Switch>
              )}
              {['/home'].includes(location.pathname) && (
                <Redirect to="/login" />
              )}
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              {/* <Route component={Login} /> */}
            </Switch>
          </div>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn:
      !!Object.keys(state.user.userData).length && !!state.user.userData.id,
    loading: state.root.loading,
    oauthError: state.user.oauthError,
  };
};

const mapDispatch = dispatch => {
  return {
    async loadInitialData() {
      dispatch(setLoading('me'));
      await dispatch(getMe());
      dispatch(unsetLoading('me'));
    },

    async loadOauthError() {
      dispatch(setLoading('oauthError'));
      await dispatch(getOauthError());
      dispatch(unsetLoading('oauthError'));
    },
  };
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Routes)
);

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  loadOauthError: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
