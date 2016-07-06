import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth, { IAuthState } from './reducers/auth';
import tasks, { ITasksState } from './reducers/tasks';
import sessions, { ISessionsState } from './reducers/sessions';

export interface IAppState {
  [key: string]: any;
  auth: IAuthState;
  routing: Redux.Reducer;
  sessions: ISessionsState;
  tasks: ITasksState;
}

export interface IGetAppState {
  (): IAppState;
}

export default combineReducers({
  routing: routerReducer,
  auth,
  sessions,
  tasks,
});
