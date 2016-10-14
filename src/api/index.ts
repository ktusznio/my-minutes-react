import * as firebase from 'firebase';

import config from '../config';
import Auth from './auth';
import Database from './database';

// This the app's interface to Firebase.

export * from './types';

export let app: firebase.app.App;
export let auth: Auth;
export let database: Database;

export const initialize = () => {
  app = firebase.initializeApp(config.firebase);
  auth = new Auth();
  auth.initialize();
  database = new Database();
  database.initialize();
}
