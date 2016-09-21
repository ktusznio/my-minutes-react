import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import { breadcrumbBuilder } from './sentryClient';

const store = createStore(
  reducer,
  applyMiddleware(thunk, breadcrumbBuilder)
);

export default store;
