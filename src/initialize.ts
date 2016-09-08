import 'moment-duration-format';
import * as Raven from 'raven-js';
import * as React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import config from './config';
import { createRouter } from './router';
import store from './store';
import pushClient from './pushClient';

// Initialize Facebook.
(<any>window).fbAsyncInit = function() {
  (<any>window).FB.init({
    appId: config.facebookAppId,
    xfbml: true,
    version: 'v2.7',
  });
};

(function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

// Initialize Sentry.
if (config.sentry.dsn) {
  Raven.config(config.sentry.dsn).install();
}

// Initialize Firebase.
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

if ('serviceWorker' in navigator) {
  // Your service-worker.js *must* be located at the top-level directory relative to your site.
  // It won't be able to control pages unless it's located at the same level or higher than them.
  // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
  // See https://github.com/slightlyoff/ServiceWorker/issues/468
  (<any> navigator).serviceWorker.register('/sw-main.js').then(registration => {
    console.log('[sw-register] registered');

    pushClient.initialize(registration);

    // updatefound is fired if service-worker.js changes.
    registration.onupdatefound = function() {
      // The updatefound event implies that registration.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      var installingWorker = registration.installing;

      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if ((<any> navigator).serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will
              // have been added to the cache.
              // It's the perfect time to display a "New content is available; please refresh."
              // message in the page's interface.
              console.log('[sw-register] New or updated content is available.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('[sw-register] Content is now available offline!');
            }
            break;

          case 'redundant':
            console.error('[sw-register] The installing service worker became redundant.');
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('[sw-register] Error during service worker registration:', e);
  });
}
