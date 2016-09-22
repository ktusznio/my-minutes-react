import * as Promise from 'bluebird';
import * as firebase from 'firebase';

import config from '../config';

// These correspond to PROVIDER_IDs (eg. firebase.auth.FacebookAuthProvider.PROVIDER_ID).
export type ProviderId = 'facebook.com' | 'google.com' | 'twitter.com';

interface IFirebaseProviderCredential {
  accessToken: string;
  provider: string;
  secret?: string;
}

interface IFirebaseAuthenticationError extends Error {
  code: string;
  email: string;
  credential: IFirebaseProviderCredential;
}

const FIREBASE_ERROR_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';
const PENDING_CREDENTIAL_KEY = 'pendingCredential';

class Firebase {
  public auth: firebase.auth.Auth;
  public db: firebase.database.Database;

  private app: firebase.app.App;
  private authProviderMap: {
    [key: string]: firebase.auth.AuthProvider;
  };

  initialize() {
    this.app = firebase.initializeApp(config.firebase);
    this.auth = firebase.auth();
    this.db = firebase.database();

    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    facebookAuthProvider.addScope('email');

    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    googleAuthProvider.addScope('email');

    const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

    this.authProviderMap = {
      'facebook.com': facebookAuthProvider,
      'google.com': googleAuthProvider,
      'twitter.com': twitterAuthProvider,
    };
  }

  signInWithProvider(providerId: ProviderId): Promise<{}> {
    // Wrap the firebase call in a promise to handle firebase errors here
    // rather than in calling code.
    return new Promise((resolve, reject) => {
      if (window.localStorage.hasOwnProperty(PENDING_CREDENTIAL_KEY)) {
        this.signInWithPendingCredential(providerId).then(
          () => resolve(),
          (error: IFirebaseAuthenticationError) => reject(new FirebaseUncaughtError(error.code)),
        );
        return;
      }

      const provider = this.getProvider(providerId);

      this.auth.signInWithPopup(provider).then(
        () => resolve(),
        (error: IFirebaseAuthenticationError) => {
          switch (error.code) {
          case FIREBASE_ERROR_ACCOUNT_EXISTS:
            // User's email already exists. Store credential for linking.
            const pendingCredential = error.credential;
            window.localStorage.setItem(
              PENDING_CREDENTIAL_KEY,
              JSON.stringify(pendingCredential)
            );

            // Get registered providers for this email.
            this.auth.fetchProvidersForEmail(error.email).then(providerIds => {
              // Recommend the first existing provider.
              reject(new FirebaseAccountExistsError(providerIds[0]));
            });
            break;

          default:
            reject(new FirebaseUncaughtError(error.code));
          }
        }
      );
    });
  }

  cancelLoginAttempt() {
    window.localStorage.removeItem(PENDING_CREDENTIAL_KEY);
  }

  private signInWithPendingCredential(providerId: ProviderId): firebase.Promise<any> {
    if (!window.localStorage.hasOwnProperty(PENDING_CREDENTIAL_KEY)) {
      return;
    }

    const provider = this.getProvider(providerId);
    const credentialJson: IFirebaseProviderCredential = JSON.parse(
      window.localStorage.getItem(PENDING_CREDENTIAL_KEY)
    );
    window.localStorage.removeItem(PENDING_CREDENTIAL_KEY);
    const credential = this.buildCredential(credentialJson);

    return this.auth.signInWithPopup(provider).then(result =>  {
      return result.user.link(credential);
    });
  }

  private buildCredential(credential: IFirebaseProviderCredential) {
    switch (credential.provider) {
      case 'facebook.com':
      return firebase.auth.FacebookAuthProvider.credential(credential.accessToken);

      case 'google.com':
      return firebase.auth.GoogleAuthProvider.credential(credential.accessToken);

      case 'twitter.com':
      return firebase.auth.TwitterAuthProvider.credential(
        credential.accessToken,
        credential.secret
      );
    }
  }

  private getProvider(providerId: ProviderId): firebase.auth.AuthProvider {
    return this.authProviderMap[providerId];
  }
}

export default new Firebase();

export function FirebaseAccountExistsError(existingProviderId) {
  this.existingProviderId = existingProviderId;
}
Object.setPrototypeOf(FirebaseAccountExistsError, Error);
FirebaseAccountExistsError.prototype = Object.create(Error.prototype);
FirebaseAccountExistsError.prototype.name = "FirebaseAccountExistsError";
FirebaseAccountExistsError.prototype.message = "";
FirebaseAccountExistsError.prototype.constructor = FirebaseAccountExistsError;


export function FirebaseUncaughtError(firebaseErrorCode) {
  this.firebaseErrorCode = firebaseErrorCode;
}
Object.setPrototypeOf(FirebaseUncaughtError, Error);
FirebaseUncaughtError.prototype = Object.create(Error.prototype);
FirebaseUncaughtError.prototype.name = "UncaughtFirebaseError";
FirebaseUncaughtError.prototype.message = "";
FirebaseUncaughtError.prototype.constructor = FirebaseUncaughtError;
