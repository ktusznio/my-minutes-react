const config = {
  beta: {
    firebase: {
      apiKey: "<found in firebase>",
      authDomain: "my-minutes-beta-cea4c.firebaseapp.com",
      databaseURL: "https://my-minutes-beta-cea4c.firebaseio.com",
      storageBucket: "my-minutes-beta-cea4c.appspot.com",
    },
    pushServer: {
      url: 'https://my-minutes-push-beta.herokuapp.com',
    },
    sentry: {
      dsn: 'https://9d05ae52b7ef497e8ac6f3293d7d88ee@app.getsentry.com/92072',
    },
  },
  development: {
    firebase: {
      apiKey: "<found in firebase>",
      authDomain: "my-minutes-development.firebaseapp.com",
      databaseURL: "https://my-minutes-development.firebaseio.com",
      storageBucket: "my-minutes-development.appspot.com",
    },
    pushServer: {
      url: 'http://localhost:3000',
    },
    sentry: {
      dsn: null,
    },
  },
};

export default config[process.env.NODE_ENV];
