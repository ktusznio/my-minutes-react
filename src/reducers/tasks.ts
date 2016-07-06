import { IReceiveTasksAction } from '../actions/tasks';
import * as actionTypes from '../actionTypes';
import * as db from '../firebase/database';
import { buildTask, ITask, TaskId } from '../models';

export interface ITasksState {
  tasks: ITasksStateTasks;
  tasksRef: firebase.database.Reference;
  tasksListener: (snapshot: firebase.database.DataSnapshot) => void;
}

interface ITasksStateTasks {
  [taskId: string]: ITask;
}

export default function tasks(
  tasksState: ITasksState = buildTasksState(),
  action
): ITasksState {
  switch(action.type) {
  case actionTypes.LISTEN_TO_TASKS: {
    const listenToTasksAction: db.IListenToRefAction = action;
    return Object.assign({}, tasksState, {
      tasksRef: listenToTasksAction.ref,
      tasksListener: listenToTasksAction.listener,
    });
  }

  case actionTypes.STOP_LISTENING_TO_TASKS: {
    return Object.assign({}, tasksState, {
      tasksRef: null,
      tasksListener: null,
    });
  }

  case actionTypes.RECEIVE_TASKS: {
    const receiveTasksAction: IReceiveTasksAction = action;
    return Object.assign({}, tasksState, {
      tasks: receiveTasksAction.snapshot || {},
    });
  }

  default:
    return tasksState;
  }
}

export const getTasks = (state: ITasksState): ITask[] => {
  if (!state.tasks) {
    return [];
  }
  return Object.keys(state.tasks).map(id => state.tasks[id])
}

const buildTasksState = (partialState = {}): ITasksState =>
  Object.assign({
    tasks: null,
    tasksRef: null,
    tasksListener: null
  }, partialState)
