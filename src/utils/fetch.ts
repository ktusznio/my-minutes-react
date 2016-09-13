import 'whatwg-fetch';

import { logException } from './error';

export const sendFetch = (url, options = {}): Promise<Response | void> =>
  fetch(url, options).then(response => {
    if (response.ok) {
      return response;
    }

    // Server responded with 4xx or 5xx.
    throw new Error(response.status + ' : ' + response.statusText);
  }).catch(e =>
    logException(e)
  );
