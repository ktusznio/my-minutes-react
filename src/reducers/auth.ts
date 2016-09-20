import * as m from '../models';
import * as authActions from '../actions/auth';
import * as actionTypes from '../actionTypes';
import { ProviderId } from '../firebase/firebase';

export interface IAuthState {
  [key: string]: any;
  status: string;
  user?: m.IUser;
  requestedProviderId?: ProviderId;
  existingProviderId?: ProviderId;
}

export default function auth(authState: IAuthState = {
  // Initial status is ATTEMPT_LOGIN to prevent flash of login button when
  // authentication is checked on app start.
  status: actionTypes.ATTEMPT_LOGIN,
}, action: authActions.IAuthAction): IAuthState {
  switch (action.type) {
  case actionTypes.ATTEMPT_LOGIN:
    return {
      requestedProviderId: action.requestedProviderId,
      status: actionTypes.ATTEMPT_LOGIN,
      user: null,
    };

  case actionTypes.ACCOUNT_EXISTS:
    return Object.assign({}, authState, {
      status: actionTypes.ACCOUNT_EXISTS,
      existingProviderId: action.existingProviderId,
    });

  case actionTypes.LOGIN_SUCCESS:
    return {
      existingProviderId: null,
      requestedProviderId: null,
      status: actionTypes.LOGIN_SUCCESS,
      user: action.user,
    }

  case actionTypes.LOGOUT:
    return {
      existingProviderId: null,
      requestedProviderId: null,
      status: actionTypes.LOGOUT,
      user: null,
    }

  default:
    return authState;
  }
}
