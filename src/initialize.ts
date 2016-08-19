import 'moment-duration-format';
import * as Raven from 'raven-js';
import * as React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import 'whatwg-fetch';

import config from './config';
import { createRouter } from './router';
import store from './store';
import * as push from './utils/push';

injectTapEventPlugin();

// Initialize sentry.
if (config.sentry.dsn) {
  Raven.config(config.sentry.dsn).install();
}

// Initialize firebase.
import './firebase';

// Start the app by rendering the router into the page.
const history = syncHistoryWithStore(browserHistory, store);
const router = createRouter(store, history);
render(router, document.getElementById('root'));

// Listen for authentication.
import * as authActions from './actions/auth';
setTimeout(() => {
  store.dispatch(authActions.startListeningToAuth());
})

// Initialize service worker.
if ('serviceWorker' in navigator) {
  (<any> navigator).serviceWorker.register('/service-worker.js').then(registration => {
    console.log("Service Worker Registered");
    push.initialize(registration);
  });
}
