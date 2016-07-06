import * as Promise from 'bluebird';

import * as m from '../models';
import * as actionTypes from '../actionTypes';
import * as db from '../firebase/database';
import { IAppState, IGetAppState } from '../reducer';
import { ITasksState } from '../reducers/tasks';

export const startListeningToTasks = (user) =>
  (dispatch: Redux.Dispatch) => {
    const { ref, listener } = db.listenToTasks(
      user.uid,
      (tasks: ITasksState) => dispatch(receiveTasks(tasks))
    );
    dispatch({
      type: actionTypes.LISTEN_TO_TASKS,
      ref,
      listener,
    });
  }

export interface IReceiveTasksAction {
  type: string;
  snapshot: ITasksState;
}

const receiveTasks = (snapshot: ITasksState): IReceiveTasksAction => ({
  type: actionTypes.RECEIVE_TASKS,
  snapshot,
});

export const stopListeningToTasks = () =>
  (dispatch: Redux.Dispatch, getState: IGetAppState) => {
    const { tasksRef, tasksListener } = getState().tasks;
    if (tasksRef && tasksListener) {
      db.stopListeningToTasks(tasksRef, tasksListener);
      dispatch({ type: actionTypes.STOP_LISTENING_TO_TASKS });
    }
  }

export const saveTask = (task: m.ITask) => {
  return (dispatch: Redux.Dispatch, getState: IGetAppState): Promise<m.ITask> => {
    // Task will be assigned an id by db.saveTask.
    db.saveTask(getState().auth.user.uid, task)
      .catch(error => dispatch(saveTaskError(error)));

    return Promise.resolve(task);
  }
};

export const saveTaskError = (error: Error) => ({
  type: actionTypes.SAVE_TASK_ERROR,
  error,
});

interface IDeleteTaskAction {
  type: string;
  task: m.ITask;
}

export const deleteTask = (task: m.ITask) =>
  (dispatch: Redux.Dispatch, getState: IGetAppState) =>
    db.deleteTask(getState().auth.user.uid, task).catch(
      (error) => dispatch(deleteTaskError(error, task))
    );

const deleteTaskError = (error, task: m.ITask) => ({
  type: actionTypes.DELETE_TASK_ERROR,
  task,
  error,
});

export const startTask = (task: m.ITask) =>
  (dispatch: Redux.Dispatch, getState: IGetAppState) =>
    db.startTask(getState().auth.user.uid, task)
      .catch(error => dispatch(startTaskError(error)));

const startTaskError = (error: Error) => ({
  type: actionTypes.START_TASK_ERROR,
  error,
});

export const stopTask = (task: m.ITask) =>
  (dispatch: Redux.Dispatch, getState: IGetAppState) =>
    db.stopTask(getState().auth.user.uid, task)
      .catch(error => dispatch(stopTaskError(error)));

const stopTaskError = (error: Error) => ({
  type: actionTypes.STOP_TASK_ERROR,
  error,
});
