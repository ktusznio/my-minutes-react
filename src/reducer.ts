import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth, { IAuthState } from './reducers/auth';
import connection, { IConnectionState } from './reducers/connection';
import tasks, { ITasksState } from './reducers/tasks';
import sessions, { ISessionsState } from './reducers/sessions';
import snackbar, { ISnackbarState } from './reducers/snackbar';

export interface IAppState {
  auth: IAuthState;
  connection: IConnectionState;
  routing: Redux.Reducer;
  sessions: ISessionsState;
  snackbar: ISnackbarState;
  tasks: ITasksState;
}

export interface IGetAppState {
  (): IAppState;
}

export default combineReducers({
  routing: routerReducer,
  auth,
  connection,
  sessions,
  snackbar,
  tasks,
});
