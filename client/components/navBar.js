import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/user';
import { setLoading, unsetLoading } from '../actions/root';

const Navbar = ({ handleClick, isLoggedIn, loading }) => (
  <div>
    <nav>
      {isLoggedIn && !loading.oauthError && !loading.loginOrSignup ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {loading.me || loading.loginOrSignup || loading.oauthError ? (
            <span>Loading...</span>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn:
      !!Object.keys(state.user.userData).length && !!state.user.userData.id,
    loading: state.root.loading,
  };
};

const mapDispatch = dispatch => {
  return {
    async handleClick() {
      dispatch(setLoading('loginOrSignup'));
      await dispatch(logout());
      dispatch(unsetLoading('loginOrSignup'));
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
