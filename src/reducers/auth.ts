import { ATTEMPT_LOGIN, LOGIN_SUCCESS, LOGOUT } from '../actionTypes';
import { IAuthAction } from '../actions/auth';
import { IGoal, IUser } from '../models';

export interface IAuthState {
  [key: string]: any;
  status: string;
  user: IUser;
}

export default function auth(authState: IAuthState = {
  status: null,
  user: null
}, action: IAuthAction): IAuthState {
  switch(action.type) {
  case ATTEMPT_LOGIN:
    return {
      status: ATTEMPT_LOGIN,
      user: null,
    };

  case LOGIN_SUCCESS:
    return {
      status: LOGIN_SUCCESS,
      user: action.user,
    }

  case LOGOUT:
    return {
      status: LOGOUT,
      user: null,
    }

  default:
    return authState;
  }
}
