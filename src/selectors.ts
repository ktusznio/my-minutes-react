import * as moment from 'moment';
import { cloneDeep } from 'lodash';

import * as m from './models';
import { IAppState } from './reducer';
import { taskSessionsForDate } from './reducers/sessions';

let viewTasksCache = {};

const getTasks = (state: IAppState) => state.tasks.tasks || {}
const getSessions = (state: IAppState) => state.sessions.sessions || {}
const getTask = (state: IAppState, taskId: m.TaskId) => getTasks(state)[taskId]

export type IViewTask = m.ITask & {
  durationOfAllSessions: number;
  msLeftForGoal: number;
  activeSession: m.ISession;
};

export const viewTaskToTask = (_task: m.ITask | (m.ITask & IViewTask)): m.ITask => {
  const task = cloneDeep(_task);
  delete (<m.ITask & IViewTask>task).durationOfAllSessions;
  delete (<m.ITask & IViewTask>task).msLeftForGoal;
  delete (<m.ITask & IViewTask>task).activeSession;
  return task;
}

// TODO memoize these computations once there is fine-grained db listening.

export const tasksSelector = (state: IAppState): IViewTask[] => {
  const tasks = getTasks(state);
  return Object.keys(tasks).map(taskId => taskSelector(state, taskId));
}

export const taskSelector = (state: IAppState, taskId: m.TaskId) => {
  const tasks = getTasks(state);
  const task = tasks[taskId] || m.buildTask();
  const sessions = getSessions(state);
  const sessionsForDate = taskSessionsForDate(sessions, taskId, moment());
  return buildViewTask(task, sessionsForDate);
}

const buildViewTask = (
  task: m.ITask,
  sessionsToday: m.ISession[] = [],
): IViewTask => {
  const activeSession = getActiveSession(sessionsToday);
  const durationOfAllSessions = sumSessionDurations(sessionsToday);
  const msLeftForGoal = getMillisecondsLeftForGoal(task.goal, durationOfAllSessions);
  return Object.assign({}, task, {
    activeSession,
    durationOfAllSessions,
    msLeftForGoal,
  });
}

const sumSessionDurations = (sessions: m.ISession[]): number => {
  return sessions.reduce((duration, session) => {
    if (!session.stoppedAt) {
      return duration;
    }
    return duration + (session.stoppedAt - session.startedAt);
  }, 0);
};

const getMillisecondsLeftForGoal = (goal: m.IGoal, durationOfSessions: number): number => {
  if (goal.type === m.GoalType.NONE) {
    return 0;
  }
  return goal.duration - durationOfSessions;
}

const getActiveSession = (sessions: m.ISession[]): m.ISession => {
  if (sessions.length === 0) {
    return null;
  }

  const lastSession = sessions[sessions.length - 1];

  if (!lastSession.stoppedAt) {
    return lastSession;
  }
}
