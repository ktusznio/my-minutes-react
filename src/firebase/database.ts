import * as firebase from 'firebase';
import * as moment from 'moment';

import * as m from '../models';
import { ISessionsState } from '../reducers/sessions';
import { ITasksState } from '../reducers/tasks';
import mmFirebase from './firebase';
import * as path from './path';

export interface IListenToRefAction {
  type: string;
  ref: firebase.database.Reference;
}

interface IConnectionListener {
  (isOnline: boolean): void;
}

export const listenToConnection = (callback: IConnectionListener) => {
  const connectedRef = mmFirebase.db.ref('.info/connected');
  connectedRef.on('value', snap => callback(snap.val()));
}

interface ITasksListener {
  (event: string, data: any): void
}

export const listenToTasks = (uid: m.UserId, callback: ITasksListener): firebase.database.Reference => {
  const ref = mmFirebase.db.ref(path.tasks(uid));
  ref.orderByKey();

  ref.on(
    'child_added',
    childData => callback('child_added', childData.val())
  );

  ref.on(
    'child_changed',
    childData => callback('child_changed', childData.val())
  );

  ref.on(
    'child_removed',
    childData => callback('child_removed', childData.key)
  );

  return ref;
};

export const stopListeningToTasks = (tasksRef) =>
  tasksRef.off();

export const saveTask = (uid: m.UserId, task: m.ITask): firebase.Promise<void> => {
  if (task.id) {
    return mmFirebase.db.ref(path.task(uid, task.id)).set(task);
  } else {
    const newTaskRef = mmFirebase.db.ref(path.tasks(uid)).push();
    task.id = newTaskRef.key;
    return newTaskRef.set(task);
  }
};

export const deleteTask = (uid: m.UserId, task: m.ITask) => {
  return mmFirebase.db.ref(path.task(uid, task.id)).remove();
}

export const startTask = (uid: m.UserId, task: m.ITask) => {
  // Create a new session.
  const now = new Date();
  const date = moment(now).format('YYYY-MM-DD');
  const sessionsPath = path.taskSessions(uid, task.id, date);
  const sessionPush = mmFirebase.db.ref(sessionsPath).push({
    startedAt: now.getTime(),
  });

  // Update task.
  const taskUpdate = mmFirebase.db.ref(path.task(uid, task.id)).update({
    state: m.TaskState.RUNNING,
    currentSessionPath: sessionsPath + '/' + sessionPush.key,
  });

  return firebase.Promise.all([
    sessionPush,
    taskUpdate
  ]);
}

export const stopTask = (uid: m.UserId, task: m.ITask) => {
  // End current session.
  const now = new Date();
  const sessionRef = mmFirebase.db.ref(task.currentSessionPath)
  const sessionUpdate = sessionRef.update({
    stoppedAt: now.getTime(),
  })

  // Update task.
  const taskRef = mmFirebase.db.ref(path.task(uid, task.id))
  const taskUpdate = taskRef.update({
    state: m.TaskState.STOPPED,
    currentSessionPath: null,
  });

  return firebase.Promise.all([
    sessionUpdate,
    taskUpdate,
  ]);
}

interface ISessionsListener {
  (event: string, taskId: m.TaskId, sessionOrSessionId): void
}

export const listenToSessions = (uid: m.UserId, callback: ISessionsListener): firebase.database.Reference => {
  const ref = mmFirebase.db.ref(path.sessions(uid))
  ref.orderByKey();

  ref.on(
    'child_added',
    childData => callback('child_added', childData.key, childData.val())
  );

  ref.on(
    'child_changed',
    childData => callback('child_changed', childData.key, childData.val())
  );

  return ref;
};

export const stopListeningToSessions = (sessionsRef) =>
  sessionsRef.off();
