import 'whatwg-fetch';

import * as actionTypes from '../actionTypes';
import * as firebaseClient from '../firebase';
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
    .then(response => {
      handleConnectionChange(true, store, dispatch);
    })
    .catch(error => {
      handleConnectionChange(false, store, dispatch);
      setTimeout(
        () => pollConnection(store, dispatch),
        1500
      );
    });
};

const handleConnectionChange = (isOnline: boolean, store: Redux.Store, dispatch: Redux.Dispatch) => {
  const state = store.getState();
  const wasOnline = state.connection.isOnline;

  if (!wasOnline && isOnline) {
    firebaseClient.initialize();
    dispatch(authActions.startListeningToAuth());
  }

  dispatch(connectionChanged(isOnline, wasOnline));
};

export const connectionChanged = (isOnline: boolean, wasOnline: boolean): IConnectionChangedAction => ({
  type: actionTypes.CONNECTION_CHANGED,
  isOnline,
  wasOnline,
});
