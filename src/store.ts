import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import { exceptionReporter } from './utils/error';

const store = createStore(
  reducer,
  applyMiddleware(thunk, exceptionReporter)
);

export default store;
