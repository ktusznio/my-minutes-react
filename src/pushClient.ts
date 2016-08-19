import * as Promise from 'bluebird';

import config from './config';
import * as m from './models';

let endpoint: string;
let userPublicKey: string = '';
let userAuth: string = '';

const initialize = (registration) => {
  registration.pushManager.getSubscription().then(subscription => {
    if (subscription) {
      return subscription;
    }
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  }).then(subscription => {
    endpoint = subscription.endpoint;

    if (subscription.getKey) {
      const rawKey = subscription.getKey('p256dh');
      userPublicKey = btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)));

      const rawAuthSecret = subscription.getKey('auth');
      userAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)));
    }
  });
};

const schedulePush = (taskId: m.TaskId, payload: m.IPushPayload, delay: number): Promise<Response> => {
  if (!endpoint) {
    return Promise.reject('No subscription endpoint present.');
  }
  if (!config.pushServer.url) {
    return Promise.reject('No push server configured.');
  }

  const pushUrl = `${config.pushServer.url}/push`;

  return fetch(pushUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userAuth,
      delay,
      endpoint,
      userPublicKey,
      payload: JSON.stringify(payload),
      startedAt: Date.now(),
      taskId,
    }),
  });
};

const cancelPush = (taskId: m.TaskId): Promise<Response> => {
  if (!config.pushServer.url) {
    return Promise.reject('No push server configured.');
  }

  const cancelUrl = `${config.pushServer.url}/cancel`;

  return fetch(cancelUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskId,
    }),
  });
}

export default {
  initialize,
  schedulePush,
  cancelPush,
}
