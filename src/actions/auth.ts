import * as actionTypes from '../actionTypes';
import * as firebaseClient from '../firebase';
import * as m from '../models';
import sentryClient from '../sentryClient';
import * as snackbarActions from './snackbar';

export interface IAuthAction {
  existingProviderId?: firebaseClient.ProviderId;
  requestedProviderId?: firebaseClient.ProviderId;
  type: string;
  user?: m.IUser;
}

export const startListeningToAuth = () => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN });
  firebaseClient.onAuthStateChanged((user: firebaseClient.IUser) => {
    dispatch(user ? loginSuccess(user) : logout());
  });
};

export const signInWithProvider = (requestedProviderId: firebaseClient.ProviderId) => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN, requestedProviderId });
  firebaseClient.signInWithProvider(requestedProviderId).catch(error => {
    if (error instanceof firebaseClient.AccountExistsError) {
      dispatch(accountExists(error.existingProviderId));
    } else if (error instanceof firebaseClient.UncaughtError) {
      dispatch(cancelLogin());
    }
  });
}

export const accountExists = (existingProviderId: firebaseClient.ProviderId): IAuthAction => ({
  type: actionTypes.ACCOUNT_EXISTS,
  existingProviderId,
});

export const loginSuccess = (user: firebaseClient.IUser) => (dispatch: Redux.Dispatch) => {
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
  firebaseClient.cancelLoginAttempt();
  dispatch(snackbarActions.postMessage('Login failed.'));
  dispatch(logout());
}

export interface ILogout {
  (): void;
}

export const logout = () => (dispatch: Redux.Dispatch) => {
  firebaseClient.signOut();
  sentryClient.setUserContext();

  dispatch({ type: actionTypes.LOGOUT });
};
