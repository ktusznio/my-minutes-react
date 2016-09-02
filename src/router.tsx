import CircularProgress from 'material-ui/CircularProgress';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerActions, routerMiddleware } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'

import * as actionTypes from './actionTypes';
import App from './components/App';
import LoginScreen from './components/LoginScreen';
import RunningTaskScreen from './components/RunningTaskScreen';
import TasksScreen from './components/TasksScreen';
import TaskScreen from './components/TaskScreen';
import { IAppState } from './reducer';
import * as routes from './utils/routes';

export interface RouteParams {
  taskId: string;
}

const loginInProgressIndicator = (props) =>
  <div>
    <div style={{ position: 'fixed', top: 0 }}>
      <p>Logging in...</p>
      <CircularProgress />
    </div>
    {props.children}
  </div>

const UserIsAuthenticated = UserAuthWrapper({
  allowRedirectBack: false,
  authSelector: (state: IAppState) => state.auth.user,
  authenticatingSelector: (state: IAppState) => {
    return state.auth.status === actionTypes.ATTEMPT_LOGIN;
  },
  LoadingComponent: loginInProgressIndicator,
  failureRedirectPath: (state: IAppState) => {
    if (state.auth.status === actionTypes.LOGOUT) {
      return routes.login();
    }
  },
  wrapperDisplayName: 'UserIsAuthenticated',
});

const Authenticated = UserIsAuthenticated((props) => props.children);

export const createRouter = (store, history) =>
  <Provider store={store}>
    <Router history={history}>
      <Route path={routes.tasks()} component={App}>
        <Route component={Authenticated}>
          <IndexRoute component={TasksScreen} />
          <Route path={routes.task(':taskId')} component={TaskScreen} />
          <Route path={routes.runningTask(':taskId')} component={RunningTaskScreen} />
        </Route>
        <Route path={routes.login()} component={LoginScreen} />
      </Route>
    </Router>
  </Provider>
