import * as moment from 'moment';

import * as actionTypes from '../actionTypes';
import * as db from '../firebase/database';
import * as m from '../models';

export interface ISessionsState {
  sessions: ISessionsStateSessions;
  sessionsRef: firebase.database.Reference;
}

interface ISessionsStateSessions {
  [taskId: string]: {
    [date: string]: {
      [sessionId: string]: m.ISession;
    }
  }
}

export default function sessions(
  sessionsState: ISessionsState = buildSessionsState(),
  action
): ISessionsState {
  switch (action.type) {
  case actionTypes.LISTEN_TO_SESSIONS: {
    const listenToSessionsAction: db.IListenToRefAction = action;
    return Object.assign({}, sessionsState, {
      sessionsRef: listenToSessionsAction.ref,
    });
  }

  case actionTypes.STOP_LISTENING_TO_SESSIONS: {
    return Object.assign({}, sessionsState, {
      sessionsRef: null,
    });
  }

  case actionTypes.LOGOUT: {
    return buildSessionsState();
  }

  case actionTypes.SESSION_ADDED: {
    const { taskId, sessionsByDate } = action;
    return Object.assign({}, sessionsState, {
      sessions: Object.assign(
        {},
        sessionsState.sessions,
        { [taskId]: sessionsByDate }
      ),
    });
  }

  case actionTypes.SESSION_CHANGED: {
    const { taskId, sessionsByDate } = action;
    return Object.assign({}, sessionsState, {
      sessions: Object.assign(
        {},
        sessionsState.sessions,
        { [taskId]: sessionsByDate }
      ),
    });
  }

  default:
    return sessionsState;
  }
}

const buildSessionsState = (partialState = {}): ISessionsState =>
  Object.assign({
    sessions: null,
    sessionsRef: null,
    sessionsListener: null
  }, partialState)
