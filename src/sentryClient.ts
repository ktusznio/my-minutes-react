import config from './config';

declare var __COMMIT_HASH__: any;
declare var __VERSION__: any;

let Raven;
if (typeof window !== 'undefined') {
  Raven = require('raven-js');
}

class SentryClient {
  private isInitialized = false;

  initialize() {
    if (Raven && config.sentry && config.sentry.dsn) {
      Raven.config(config.sentry.dsn).install();
      Raven.setExtraContext({
        'my-minutes-commit-hash': __COMMIT_HASH__,
        'my-minutes-version': __VERSION__,
      });
      this.isInitialized = true;
    }
  }

  captureException(e, extra = {}) {
    /*eslint no-console:0*/
    window.console && console.error && console.error(e);

    if (this.isInitialized) {
      Raven.captureException(e, { extra });
    }
  }

  captureBreadcrumb(crumb) {
    if (this.isInitialized) {
      Raven.captureBreadcrumb(crumb);
    }
  }

  setUserContext(context = undefined) {
    if (this.isInitialized) {
      Raven.setUserContext(context);
    }
  }
}

const instance = new SentryClient();
export default instance;

export const breadcrumbBuilder = (store: Redux.Store) => next => action => {
  instance.captureBreadcrumb({
    message: action.type,
    data: action,
    category: 'action',
    level: 'info',
  });

  next(action);
};
