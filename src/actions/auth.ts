import { browserHistory } from 'react-router';

import * as actionTypes from '../actionTypes';
import auth from '../firebase/auth';
import { IUser } from '../models';

export interface IAuthAction {
  type: string;
  status: string;
  user: IUser;
}

export const startListeningToAuth = () =>
  (dispatch: Redux.Dispatch) => {
    auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        dispatch(loginSuccess(user))
      } else {
        dispatch(logout());
      }
    });
  }

export const loginSuccess = (user: firebase.User) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    user,
  };
}

interface ILogoutAction {
  type: string;
}

export interface ILogout {
  (): ILogoutAction;
}

export const logout = () =>
  (dispatch: Redux.Dispatch): ILogoutAction => {
    auth.signOut().then(() => {
      browserHistory.push('/login');
    }, (error) => {
      console.error('error logging out', error)
    });

    return {
      type: actionTypes.LOGOUT,
    };
  }
