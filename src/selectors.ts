import * as moment from 'moment';
import { cloneDeep, find } from 'lodash';

import * as m from './models';
import { IAppState } from './reducer';
import * as taskUtils from './utils/task';

let viewTasksCache = {};

const getTasks = (state: IAppState) => state.tasks.tasks || {}
const getTaskSessionsByDate = (state: IAppState, taskId: m.TaskId) => (state.sessions.sessions && state.sessions.sessions[taskId]) || {}
const getTask = (state: IAppState, taskId: m.TaskId) => getTasks(state)[taskId]

export interface IViewTaskHistory {
  [date: string]: m.GoalStatus;
}

export type IViewTask = m.ITask & {
  // TODO refactor into 'today' property?
  activeSession: m.ISession;
  durationOfAllSessions: number;
  msLeftForGoal: number;

  history: IViewTaskHistory;
};

export const viewTaskToTask = (_task: m.ITask | (m.ITask & IViewTask)): m.ITask => {
  const task = cloneDeep(_task);
  delete (<m.ITask & IViewTask>task).activeSession;
  delete (<m.ITask & IViewTask>task).durationOfAllSessions;
  delete (<m.ITask & IViewTask>task).history;
  delete (<m.ITask & IViewTask>task).msLeftForGoal;
  return task;
};

export const tasksSelector = (state: IAppState): IViewTask[] => {
  const tasks = getTasks(state);
  return Object.keys(tasks).map(taskId => taskSelector(state, taskId));
};

export const taskSelector = (state: IAppState, taskId: m.TaskId) => {
  const tasks = getTasks(state);
  const task = tasks[taskId] || m.buildTask();
  const sessionsByDate = getTaskSessionsByDate(state, taskId);

  return buildViewTask(task, sessionsByDate);
};

const buildViewTask = (
  task: m.ITask,
  sessionsByDate = {}
): IViewTask => {
  const sessionsTodayById = sessionsByDate[moment().format('YYYY-MM-DD')] || {};
  const sessionsToday = Object.keys(sessionsTodayById).map(id => sessionsTodayById[id]);

  const activeSession = getActiveSession(sessionsToday);
  const durationOfAllSessions = taskUtils.sumSessionDurations(sessionsToday);
  const history = taskUtils.buildTaskHistory(task, sessionsByDate);
  const msLeftForGoal = taskUtils.getMillisecondsLeftForGoal(task.goal, durationOfAllSessions);

  return Object.assign({}, task, {
    activeSession,
    durationOfAllSessions,
    history,
    msLeftForGoal,
  });
};

const getActiveSession = (sessions: m.ISession[] = []): m.ISession =>
  find(sessions, session => !session.stoppedAt);
