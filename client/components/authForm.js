import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions/user';
import { setLoading, unsetLoading } from '../actions/root';

/**
 * COMPONENT
 */
const AuthForm = props => {
  const { name, displayName, handleSubmit, error, loading } = props;

  return (
    <div>
      <form onSubmit={handleSubmit} name={name}>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" disabled={loading.loginOrSignup} />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input
            name="password"
            type="password"
            disabled={loading.loginOrSignup}
          />
        </div>
        <div>
          <button type="submit" disabled={loading.loginOrSignup}>
            {displayName}
          </button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
      {loading.loginOrSignup ? (
        <span>{displayName} with Google</span>
      ) : (
        <a href="/auth/google">{displayName} with Google</a>
      )}
      {/* Add CSRF support */}
    </div>
  );
};

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
    loading: state.root.loading,
  };
};

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
    loading: state.root.loading,
  };
};

const mapDispatch = dispatch => {
  return {
    async handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const formData = {
        email: evt.target.email.value,
        password: evt.target.password.value,
      };
      dispatch(setLoading('loginOrSignup'));
      await dispatch(auth(formData, formName));
      dispatch(unsetLoading('loginOrSignup'));
    },
  };
};

export const Login = connect(
  mapLogin,
  mapDispatch
)(AuthForm);
export const Signup = connect(
  mapSignup,
  mapDispatch
)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};
