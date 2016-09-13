import * as firebase from 'firebase';

import config from '../config';

class Firebase {
  public auth: firebase.auth.Auth;
  public db: firebase.database.Database;

  private app: firebase.app.App;
  private facebookAuthProvider: firebase.auth.FacebookAuthProvider;

  initialize() {
    this.app = firebase.initializeApp(config.firebase);
    this.auth = firebase.auth();
    this.db = firebase.database();

    this.facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.facebookAuthProvider.addScope('email');
  }

  signInWithRedirect() {
    this.auth.signInWithRedirect(this.facebookAuthProvider);
  }
}

export default new Firebase();
