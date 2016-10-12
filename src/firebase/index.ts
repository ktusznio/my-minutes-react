import * as Promise from 'bluebird';

import firebaseClient, { ProviderId, FirebaseAccountExistsError, FirebaseUncaughtError } from './firebaseClient';
import * as db from './database';

export type IReference = firebase.database.Reference;
export type ProviderId = ProviderId;
export type IUser = firebase.User;
export type IListenToRefAction = db.IListenToRefAction;

export const AccountExistsError = FirebaseAccountExistsError;
export const UncaughtError = FirebaseUncaughtError;

export const initialize = () => {
  firebaseClient.initialize();
};

export const onAuthStateChanged = (callback) => {
  firebaseClient.auth.onAuthStateChanged(callback);
};

export const signInWithProvider = (providerId: ProviderId): Promise<{}> => {
  return firebaseClient.signInWithProvider(providerId);
};

export const cancelLoginAttempt = () => {
  return firebaseClient.cancelLoginAttempt();
};

export const signOut = () => {
  return firebaseClient.auth.signOut();
};

export const listenToTasks = db.listenToTasks;
export const stopListeningToTasks = db.stopListeningToTasks;
export const saveTask = db.saveTask;
export const deleteTask = db.deleteTask;
export const startTask = db.startTask;
export const stopTask = db.stopTask;

export const listenToSessions = db.listenToSessions;
export const stopListeningToSessions = db.stopListeningToSessions;

// Firebase replaces this placeholder with the server's current time.
export const SERVER_TIMESTAMP = db.SERVER_TIMESTAMP;
