import * as actionTypes from '../actionTypes';
import * as api from '../api';

import * as m from '../models';
import sentryClient from '../sentryClient';
import * as snackbarActions from './snackbar';

export interface IAuthAction {
  existingProviderId?: api.ProviderId;
  requestedProviderId?: api.ProviderId;
  type: string;
  user?: m.IUser;
}

export const startListeningToAuth = () => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN });
  api.auth.onAuthStateChanged((user: api.IUser) => {
    dispatch(user ? loginSuccess(user) : logout());
  });
};

export const signInWithProvider = (requestedProviderId: api.ProviderId) => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN, requestedProviderId });
  api.auth.signInWithProvider(requestedProviderId).catch(error => {
    if (error instanceof api.AccountExistsError) {
      dispatch(accountExists(error.existingProviderId));
    } else if (error instanceof api.UncaughtError) {
      dispatch(cancelLogin());
    }
  });
}

export const accountExists = (existingProviderId: api.ProviderId): IAuthAction => ({
  type: actionTypes.ACCOUNT_EXISTS,
  existingProviderId,
});

export const loginSuccess = (user: api.IUser) => (dispatch: Redux.Dispatch) => {
  sentryClient.setUserContext({
    email: user.email,
    id: user.uid,
  });

  dispatch({
    type: actionTypes.LOGIN_SUCCESS,
    user,
  });
}

export const cancelLogin = () => (dispatch: Redux.Dispatch) => {
  api.auth.cancelLoginAttempt();
  dispatch(snackbarActions.postMessage('Login failed.'));
  dispatch(logout());
}

export interface ILogout {
  (): void;
}

export const logout = () => (dispatch: Redux.Dispatch) => {
  api.auth.signOut();
  sentryClient.setUserContext();

  dispatch({ type: actionTypes.LOGOUT });
};
