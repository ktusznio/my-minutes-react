import * as firebase from 'firebase';
import * as moment from 'moment';

import * as m from '../models';
import * as path from './path';

interface IConnectionListener {
  (isOnline: boolean): void;
}

interface ITasksListener {
  (event: string, data: any): void
}

interface ISessionsListener {
  (event: string, taskId: m.TaskId, sessionOrSessionId): void
}

export default class Database {
  private database: firebase.database.Database;

  initialize() {
    this.database = firebase.database();
  }

  listenToConnection(callback: IConnectionListener) {
    const connectedRef = this.database.ref('.info/connected');
    connectedRef.on('value', snap => callback(snap.val()));
  }

  listenToTasks(uid: m.UserId, callback: ITasksListener): firebase.database.Reference {
    const ref = this.database.ref(path.tasks(uid));
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
  }

  stopListeningToTasks(tasksRef) {
    return tasksRef.off();
  }

  saveTask(uid: m.UserId, task: m.ITask): firebase.Promise<void> {
    if (task.id) {
      return this.database.ref(path.task(uid, task.id)).set(task);
    } else {
      const newTaskRef = this.database.ref(path.tasks(uid)).push();
      task.id = newTaskRef.key;
      return newTaskRef.set(task);
    }
  }

  deleteTask(uid: m.UserId, task: m.ITask) {
    return this.database.ref(path.task(uid, task.id)).remove();
  }

  startTask(uid: m.UserId, task: m.ITask) {
    // Create a new session.
    const now = new Date();
    const date = moment(now).format('YYYY-MM-DD');
    const sessionsPath = path.taskSessions(uid, task.id, date);
    const sessionPush = this.database.ref(sessionsPath).push({
      startedAt: now.getTime(),
    });

    // Update task.
    const taskUpdate = this.database.ref(path.task(uid, task.id)).update({
      state: m.TaskState.RUNNING,
      currentSessionPath: sessionsPath + '/' + sessionPush.key,
    });

    return firebase.Promise.all([
      sessionPush,
      taskUpdate
    ]);
  }

  stopTask(uid: m.UserId, task: m.ITask) {
    // End current session.
    const now = new Date();
    const sessionRef = this.database.ref(task.currentSessionPath)
    const sessionUpdate = sessionRef.update({
      stoppedAt: now.getTime(),
    })

    // Update task.
    const taskRef = this.database.ref(path.task(uid, task.id))
    const taskUpdate = taskRef.update({
      state: m.TaskState.STOPPED,
      currentSessionPath: null,
    });

    return firebase.Promise.all([
      sessionUpdate,
      taskUpdate,
    ]);
  }

  listenToSessions(uid: m.UserId, callback: ISessionsListener): firebase.database.Reference {
    const ref = this.database.ref(path.sessions(uid))
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
  }

  stopListeningToSessions(sessionsRef) {
    return sessionsRef.off();
  }

  getServerTimestamp() {
    return (<any>firebase.database).ServerValue.TIMESTAMP;
  }
}
