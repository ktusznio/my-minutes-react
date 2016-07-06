import * as React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerActions, routerMiddleware } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'

import * as routes from './utils/routes';
import App from './components/App';
import LoginScreen from './components/LoginScreen';
import RunningTaskScreen from './components/RunningTaskScreen';
import TasksScreen from './components/TasksScreen';
import TaskScreen from './components/TaskScreen';

export interface RouteParams {
  taskId: string;
}

const CheckAuth = UserAuthWrapper({
  authSelector: (state) => state.auth.user,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated',
});

export const createRouter = (store, history) =>
  <Provider store={store}>
    <Router history={history}>
      <Route path={routes.tasks()} component={App}>
        <IndexRoute component={CheckAuth(TasksScreen)} />
        <Route path={routes.task(':taskId')} component={CheckAuth(TaskScreen)} />
        <Route path={routes.runningTask(':taskId')} component={CheckAuth(RunningTaskScreen)} />

        <Route path={routes.login()} component={LoginScreen} />
      </Route>
    </Router>
  </Provider>
