import { browserHistory } from 'react-router';

import * as actionTypes from '../actionTypes';
import firebase, { ProviderId, FirebaseAccountExistsError, FirebaseUncaughtError } from '../firebase/firebase';
import { IUser } from '../models';
import sentryClient from '../sentryClient';
import * as snackbarActions from './snackbar';

export interface IAuthAction {
  existingProviderId?: ProviderId;
  requestedProviderId?: ProviderId;
  type: string;
  user?: IUser;
}

export const startListeningToAuth = () => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN });
  firebase.auth.onAuthStateChanged((user: firebase.User) => {
    dispatch(user ? loginSuccess(user) : logout());
  });
};

export const signInWithProvider = (requestedProviderId: ProviderId) => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN, requestedProviderId });

  firebase.signInWithProvider(requestedProviderId).catch(error => {
    if (error instanceof FirebaseAccountExistsError) {
      dispatch(accountExists(error.existingProviderId));
    } else if (error instanceof FirebaseUncaughtError) {
      dispatch(cancelLogin());
    }
  });
}

export const accountExists = (existingProviderId: ProviderId): IAuthAction => ({
  type: actionTypes.ACCOUNT_EXISTS,
  existingProviderId,
});

export const loginSuccess = (user: firebase.User) => (dispatch: Redux.Dispatch) => {
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
  firebase.cancelLoginAttempt();
  dispatch(snackbarActions.postMessage('Login failed.'));
  dispatch(logout());
}

export interface ILogout {
  (): void;
}

export const logout = () => (dispatch: Redux.Dispatch) => {
  firebase.auth.signOut();
  sentryClient.setUserContext();

  dispatch({ type: actionTypes.LOGOUT });
};
