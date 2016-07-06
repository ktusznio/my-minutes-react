import * as m from '../models';
import * as actionTypes from '../actionTypes';
import * as db from '../firebase/database';
import { IAppState, IGetAppState } from '../reducer';
import { ISessionsState } from '../reducers/sessions';

export const startListeningToSessions = (user) =>
  (dispatch: Redux.Dispatch, getState: IGetAppState) => {
    const { ref, listener } = db.listenToSessions(
      user.uid,
      (sessions: ISessionsState) => dispatch(receiveSessions(sessions))
    );
    dispatch({
      type: actionTypes.LISTEN_TO_SESSIONS,
      ref,
      listener,
    } as db.IListenToRefAction);
  }

export interface IReceiveSessionsAction {
  type: string;
  snapshot: ISessionsState;
}

const receiveSessions = (snapshot: ISessionsState): IReceiveSessionsAction => ({
  type: actionTypes.RECEIVE_SESSIONS,
  snapshot,
});

export const stopListeningToSessions = () =>
  (dispatch: Redux.Dispatch, getState: IGetAppState) => {
    const { sessionsRef, sessionsListener } = getState().sessions;
    if (sessionsRef && sessionsListener) {
      db.stopListeningToSessions(sessionsRef, sessionsListener);
      dispatch({ type: actionTypes.STOP_LISTENING_TO_SESSIONS });
    }
  }
