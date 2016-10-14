import * as Promise from 'bluebird';

import * as m from '../models';
import * as actionTypes from '../actionTypes';
import * as api from '../api';
import { IGetAppState } from '../reducer';
import { IViewTask } from '../selectors';

export const startListeningToTasks = (user) => (dispatch: Redux.Dispatch) => {
  const ref = api.database.listenToTasks(user.uid, (event: string, taskOrTaskId) => {
    switch (event) {
    case 'child_added':
      dispatch(taskAdded(taskOrTaskId));
      return;

    case 'child_changed':
      dispatch(taskChanged(taskOrTaskId));
      return;

    case 'child_removed':
      dispatch(taskRemoved(taskOrTaskId));
      return;

    default:
      throw new Error('unknown event emitted by listenToTasks');
    }
  });

  dispatch({
    type: actionTypes.LISTEN_TO_TASKS,
    ref,
  });
}

const taskAdded = (task) => ({
  type: actionTypes.TASK_ADDED,
  task,
});

const taskChanged = (task) => ({
  type: actionTypes.TASK_CHANGED,
  task,
});

const taskRemoved = (taskId) => ({
  type: actionTypes.TASK_REMOVED,
  taskId,
});

export const stopListeningToTasks = () => (dispatch: Redux.Dispatch, getState: IGetAppState) => {
  const { tasksRef } = getState().tasks;
  if (tasksRef) {
    api.database.stopListeningToTasks(tasksRef);
    dispatch({ type: actionTypes.STOP_LISTENING_TO_TASKS });
  }
}

export const saveTask = (task: m.ITask) =>
  (dispatch: Redux.Dispatch, getState: IGetAppState): Promise<m.ITask> => {
    // Task will be assigned an id by saveTask.
    api.database.saveTask(getState().auth.user.uid, task)
      .catch(error => {
        dispatch(saveTaskError(error));
      });

    return Promise.resolve(task);
  }

export const saveTaskError = (error: Error) => ({
  type: actionTypes.SAVE_TASK_ERROR,
  error,
});

interface IDeleteTaskAction {
  type: string;
  task: m.ITask;
}

export const deleteTask = (task: m.ITask) => (dispatch: Redux.Dispatch, getState: IGetAppState) =>
  api.database.deleteTask(getState().auth.user.uid, task).catch(
    (error) => dispatch(deleteTaskError(error, task))
  );

const deleteTaskError = (error, task: m.ITask) => ({
  type: actionTypes.DELETE_TASK_ERROR,
  task,
  error,
});

export const startTask = (task: IViewTask) => (dispatch: Redux.Dispatch, getState: IGetAppState) => {
  api.database.startTask(
    getState().auth.user.uid,
    task
  )
  .catch(error => dispatch(startTaskError(error)));
}

const startTaskError = (error: Error) => ({
  type: actionTypes.START_TASK_ERROR,
  error,
});

export const stopTask = (task: IViewTask) => (dispatch: Redux.Dispatch, getState: IGetAppState) => {
  api.database.stopTask(
    getState().auth.user.uid,
    task
  )
  .catch(error => dispatch(stopTaskError(error)));
}

const stopTaskError = (error: Error) => ({
  type: actionTypes.STOP_TASK_ERROR,
  error,
});
