import * as moment from 'moment';

import * as m from '../models';
import { ISessionsState } from '../reducers/sessions';
import { ITasksState } from '../reducers/tasks';
import { database } from './index';
import * as path from './path';

export interface IListenToRefAction {
  type: string;
  ref: firebase.database.Reference;
  listener: (snapshot: firebase.database.DataSnapshot) => void;
}

interface ITasksListener {
  (tasks: ITasksState): void
}

interface IRefAndListener {
  ref: firebase.database.Reference;
  listener: (snapshot: firebase.database.DataSnapshot) => void;
}

export const listenToTasks = (uid: m.UserId, callback: ITasksListener): IRefAndListener => {
  const ref = database.ref(path.tasks(uid))
  const listener = ref.on(
    'value',
    snapshot => callback(snapshot.val() as ITasksState)
  );

  return { ref, listener };
};

export const stopListeningToTasks = (tasksRef, listener) =>
  tasksRef.off('value', listener);

export const saveTask = (uid: m.UserId, task: m.ITask): firebase.Promise<m.ITask> => {
  if (task.id) {
    return database.ref(path.task(uid, task.id)).set(task);
  } else {
    const newTaskRef = database.ref(path.tasks(uid)).push();
    task.id = newTaskRef.key;
    return newTaskRef.set(task);
  }
};

export const deleteTask = (uid: m.UserId, task: m.ITask) => {
  return database.ref(path.task(uid, task.id)).remove();
}

export const startTask = (uid: m.UserId, task: m.ITask) => {
  // Create a new session.
  const now = new Date();
  const date = moment(now).format('YYYY-MM-DD');
  const sessionsPath = path.taskSessions(uid, task.id, date);
  const sessionPush = database.ref(sessionsPath).push({
    startedAt: now.getTime(),
  });

  // Update task.
  const taskUpdate = database.ref(path.task(uid, task.id)).update({
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
  const sessionRef = database.ref(task.currentSessionPath)
  const sessionUpdate = sessionRef.update({
    stoppedAt: now.getTime(),
  })

  // Update task.
  const taskRef = database.ref(path.task(uid, task.id))
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
  (sessions: ISessionsState): void
}

export const listenToSessions = (uid: m.UserId, callback: ISessionsListener): IRefAndListener => {
  const ref = database.ref(path.sessions(uid))
  const listener = ref.on(
    'value',
    snapshot => callback(snapshot.val() as ISessionsState)
  );

  return { ref, listener };
};

export const stopListeningToSessions = (sessionsRef, listener) =>
  sessionsRef.off('value', listener);
