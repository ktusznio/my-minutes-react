import * as Promise from 'bluebird';

import config from '../config';
import * as m from '../models';
import * as db from '../firebase/database';

let endpoint: string;
let key: string = '';
let authSecret: string = '';

export const initialize = (registration) => {
  registration.pushManager.getSubscription().then(subscription => {
    if (subscription) {
      return subscription;
    }
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  }).then(subscription => {
    endpoint = subscription.endpoint;

    if (subscription.getKey) {
      const rawKey = subscription.getKey('p256dh');
      key = btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)));

      const rawAuthSecret = subscription.getKey('auth');
      authSecret = btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)));
    }
  });
};

export const sendPush = (uid: m.UserId, message: m.IPushMessage): Promise<Response> => {
  if (!endpoint) {
    return Promise.reject('No subscription endpoint present.');
  }
  if (!config.pushServer.url) {
    return Promise.reject('No push server configured.');
  }

  const pushUrl = `${config.pushServer.url}/push`;

  return window.fetch(pushUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      key,
      authSecret,
      payload: JSON.stringify(message.payload),
      delay: message.delay,
    }),
  });
};
