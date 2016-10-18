# My Minutes

My Minutes is a simple time-tracker to set goals for your time. You can set "at most" goals to limit time spent, or "at least" goals to build a habit.

Find more info about the app, and its iOS-only progenitor, [here](http://www.myminutesapp.com/).

## Demo

You can demo My Minutes [here](https://my-minutes-beta-2.firebaseapp.com/).

Try it on a mobile device with [service-worker support](http://caniuse.com/#feat=serviceworkers) to preview its [Progressive Web App (PWA) affordances](https://developers.google.com/web/progressive-web-apps/).

## Architecture

My Minutes is built using:

* [TypeScript](https://www.typescriptlang.org/)
* [Firebase](https://firebase.google.com/)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [Webpack](https://webpack.github.io/)
* [service-worker](https://developer.mozilla.org/en/docs/Web/API/Service_Worker_API)
* [material-ui](http://www.material-ui.com/)

Most architectural choices stem from these tools.

* Authentication is handled by Firebase.
* App state is stored in reducers.
* UI interactions dispatch Redux actions.
* [Redux-thunk](https://github.com/gaearon/redux-thunk) is used to dispatch async actions where necessary (eg. interactions with Firebase, other network calls).
* Firebase usage is encapsulated in a client exposed by `src/api/index.ts`

## Limitations

* Offline support: the app is resilient when network connectivity is lost (thanks to Firebase) but still requires a network connection to authenticate on launch. This is a limitation in Firebase's web client.

## Developing

1. Install dependencies: `npm install`
2. Install typings: `typings install`
3. Create config.ts: `cp config.sample.ts config.ts` and fill in required values.
4. [Create a Firebase app](https://console.firebase.google.com/) and fill in config values.
5. [Create a Facebook app](https://developers.facebook.com/apps/) and fill in config values.
6. Start dev server: `npm start`
7. Open [localhost:8080](http://localhost:8080).

## Deploying

```
npm install -g firebase-tools
npm run-script build
firebase use <firebase app id>
firebase deploy
```

## TODOs

* Web push notifications.
* Cache selector results in `src/selectors`.
* More tests.

## License

This code is made available under the [GNU GPLv3](http://choosealicense.com/licenses/gpl-3.0/#) license.
