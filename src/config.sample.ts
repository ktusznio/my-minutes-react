const config = {
  beta: {
    facebookAppId: '<found in facebook developer site>',
    firebase: {
      apiKey: '<found in firebase console>',
      authDomain: '<found in firebase console>',
      databaseURL: '<found in firebase console>',
      storageBucket: '<found in firebase console>',
    },
    sentry: {
      dsn: '<found in sentry>',
    },
  },
  development: {
    // ...
  },
  test: {
    // ...
  }
};

export default config[process.env.NODE_ENV];
