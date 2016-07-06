import * as firebase from 'firebase';

import config from '../config';

export const app = firebase.initializeApp(config.firebase);
export const auth = firebase.auth();
export const database = firebase.database();
