import { omit } from 'lodash';

import * as actionTypes from '../actionTypes';
import * as api from '../api';
import { ITask } from '../models';

export interface ITasksState {
  tasks: ITasksStateTasks;
  tasksRef: api.IReference;
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
    const listenToTasksAction: api.IListenToRefAction = action;
    return Object.assign({}, tasksState, {
      tasksRef: listenToTasksAction.ref,
    });
  }

  case actionTypes.STOP_LISTENING_TO_TASKS: {
    return Object.assign({}, tasksState, {
      tasksRef: null,
    });
  }

  case actionTypes.LOGOUT: {
    return buildTasksState();
  }

  case actionTypes.TASK_ADDED: {
    const task = action.task;
    return Object.assign({}, tasksState, {
      tasks: Object.assign({}, tasksState.tasks, {
        [task.id]: task,
      }),
    });
  }

  case actionTypes.TASK_CHANGED: {
    const task = action.task;
    return Object.assign({}, tasksState, {
      tasks: Object.assign({}, tasksState.tasks, {
        [task.id]: task,
      }),
    });
  }

  case actionTypes.TASK_REMOVED: {
    const taskId = action.taskId;
    return Object.assign({}, tasksState, {
      tasks: omit(tasksState.tasks, taskId),
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
