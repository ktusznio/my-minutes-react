import { IConnectionChangedAction } from '../actions/connection';
import * as actionTypes from '../actionTypes';

export interface IConnectionState {
  isOnline: boolean;
}

export default function connection(
  connectionState: IConnectionState = { isOnline: false },
  action: IConnectionChangedAction
): IConnectionState {
  switch(action.type) {
  case actionTypes.CONNECTION_CHANGED:
    return {
      isOnline: action.isOnline,
    };

  default:
    return connectionState;
  }
}
