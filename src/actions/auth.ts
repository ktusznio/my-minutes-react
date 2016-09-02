import { browserHistory } from 'react-router';

import * as actionTypes from '../actionTypes';
import auth, { signInWithRedirect, facebookAuthProvider } from '../firebase/auth';
import { IUser } from '../models';
import { logException } from '../utils/error';

export interface IAuthAction {
  type: string;
  status: string;
  user: IUser;
}

export const startListeningToAuth = () => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN });
  auth.onAuthStateChanged((user: firebase.User) => {
    dispatch(user ? loginSuccess(user) : logout());
  });
};

export const signInWithFacebook = () => (dispatch: Redux.Dispatch) => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN });
  signInWithRedirect(facebookAuthProvider);
}

export const loginSuccess = (user: firebase.User) => ({
  type: actionTypes.LOGIN_SUCCESS,
  user,
});

export interface ILogout {
  (): void;
}

export const logout = () => (dispatch: Redux.Dispatch) => {
  auth.signOut().catch(logException);
  dispatch({ type: actionTypes.LOGOUT });
};
