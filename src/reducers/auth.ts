import * as m from '../models';
import { IAuthAction } from '../actions/auth';
import * as actionTypes from '../actionTypes';

export interface IAuthState {
  [key: string]: any;
  status: string;
  user: m.IUser;
}

export default function auth(authState: IAuthState = {
  status: null,
  user: null
}, action: IAuthAction): IAuthState {
  switch(action.type) {
  case actionTypes.ATTEMPT_LOGIN:
    return {
      status: actionTypes.ATTEMPT_LOGIN,
      user: null,
    };

  case actionTypes.LOGIN_SUCCESS:
    return {
      status: actionTypes.LOGIN_SUCCESS,
      user: action.user,
    }

  case actionTypes.LOGOUT:
    return {
      status: actionTypes.LOGOUT,
      user: null,
    }

  default:
    return authState;
  }
}
