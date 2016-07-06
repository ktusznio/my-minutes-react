import * as moment from 'moment';

import { IReceiveSessionsAction } from '../actions/sessions';
import * as actionTypes from '../actionTypes';
import * as db from '../firebase/database';
import * as m from '../models';

export interface ISessionsState {
  sessions: ISessionsStateSessions;
  sessionsRef: firebase.database.Reference;
  sessionsListener: (snapshot: firebase.database.DataSnapshot) => void;
}

interface ISessionsStateSessions {
  [taskId: string]: {
    [date: string]: {
      [sessionId: string]: m.ISession;
    }
  }
}

export const taskSessionsForDate = (sessions: ISessionsStateSessions, taskId: m.TaskId, date: moment.Moment): m.ISession[] => {
  const dateKey = date.format('YYYY-MM-DD');
  if (!sessions || !sessions[taskId] || !sessions[taskId][dateKey]) {
    return [];
  }

  const sessionsById = sessions[taskId][dateKey];
  return Object.keys(sessionsById).map(id => sessionsById[id]);
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
      sessionsListener: listenToSessionsAction.listener,
    });
  }

  case actionTypes.STOP_LISTENING_TO_SESSIONS: {
    return Object.assign({}, sessionsState, {
      sessionsRef: null,
      sessionsListener: null,
    });
  }

  case actionTypes.RECEIVE_SESSIONS: {
    const receiveSessionsAction: IReceiveSessionsAction = action;
    return Object.assign({}, sessionsState, {
      sessions: action.snapshot || {},
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
