import 'whatwg-fetch';

import * as actionTypes from '../actionTypes';
import * as api from '../api';
import * as authActions from './auth';

export interface IConnectionChangedAction {
  type: string;
  isOnline: boolean;
  wasOnline: boolean;
}

export const startListeningToConnection = (store: Redux.Store) => (dispatch: Redux.Dispatch) => {
  pollConnection(store, dispatch)
};

const pollConnection = (store: Redux.Store, dispatch: Redux.Dispatch) => {
  fetch('/images/icons/favicon-16x16.png?' + Date.now())
    .catch(error => {
      console.error('connection poll failed', error);
      handleConnectionChange(false, store, dispatch);
      setTimeout(
        () => pollConnection(store, dispatch),
        1500
      );
    })
    .then(response => {
      handleConnectionChange(true, store, dispatch);
    });
};

const handleConnectionChange = (isOnline: boolean, store: Redux.Store, dispatch: Redux.Dispatch) => {
  const state = store.getState();
  const wasOnline = state.connection.isOnline;

  if (!wasOnline && isOnline) {
    api.initialize();
    dispatch(authActions.startListeningToAuth());
  }

  dispatch(connectionChanged(isOnline, wasOnline));
};

export const connectionChanged = (isOnline: boolean, wasOnline: boolean): IConnectionChangedAction => ({
  type: actionTypes.CONNECTION_CHANGED,
  isOnline,
  wasOnline,
});
