const config = {
  beta: {
    facebookAppId: '<found in facebook developer site>',
    firebase: {
      apiKey: '<found in firebase>',
      authDomain: 'my-minutes-beta-cea4c.firebaseapp.com',
      databaseURL: 'https://my-minutes-beta-cea4c.firebaseio.com',
      storageBucket: 'my-minutes-beta-cea4c.appspot.com',
    },
    sentry: {
      dsn: 'https://9d05ae52b7ef497e8ac6f3293d7d88ee@app.getsentry.com/92072',
    },
  },
  development: {
    facebookAppId: '<found in facebook developer site>',
    firebase: {
      apiKey: '<found in firebase>',
      authDomain: 'my-minutes-development.firebaseapp.com',
      databaseURL: 'https://my-minutes-development.firebaseio.com',
      storageBucket: 'my-minutes-development.appspot.com',
    },
    sentry: {
      dsn: null,
    },
  },
};

export default config[process.env.NODE_ENV];
