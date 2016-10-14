import * as firebase from 'firebase';

// These correspond to PROVIDER_IDs (eg. firebase.auth.FacebookAuthProvider.PROVIDER_ID).
export type ProviderId = 'facebook.com' | 'google.com' | 'twitter.com';
export type IReference = firebase.database.Reference;
export type IUser = firebase.User;

export interface IListenToRefAction {
  type: string;
  ref: firebase.database.Reference;
}

export function UncaughtError(firebaseErrorCode) {
  this.firebaseErrorCode = firebaseErrorCode;
}
Object.setPrototypeOf(UncaughtError, Error);
UncaughtError.prototype = Object.create(Error.prototype);
UncaughtError.prototype.name = "UncaughtError";
UncaughtError.prototype.message = "";
UncaughtError.prototype.constructor = UncaughtError;

export function AccountExistsError(existingProviderId) {
  this.existingProviderId = existingProviderId;
}
Object.setPrototypeOf(AccountExistsError, Error);
AccountExistsError.prototype = Object.create(Error.prototype);
AccountExistsError.prototype.name = "AccountExistsError";
AccountExistsError.prototype.message = "";
AccountExistsError.prototype.constructor = AccountExistsError;
