import * as firebase from 'firebase';

import { auth } from './index';
export default auth;

export const signInWithRedirect = auth.signInWithRedirect.bind(auth);

export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
facebookAuthProvider.addScope('email');
