import * as Raven from 'raven-js';

export const logException = (e, context = {}) => {
  Raven.captureException(e, {
    extra: context
  });

  /*eslint no-console:0*/
  window.console && console.error && console.error(e);
};

export const exceptionReporter = store => next => action => {
  try {
    return next(action);
  } catch (e) {
    logException(e, {
      action: action,
      state: store.getState(),
    });
  }
};
