import * as moment from 'moment';

import * as m from '../models';
import { IViewTask, IViewTaskHistory } from '../selectors';

export const getTaskTime = (task: IViewTask): number => {
  if (!task.activeSession) {
    return task.durationOfAllSessions;
  }
  return getSessionDuration(task.activeSession) + task.durationOfAllSessions;
};

export const getGoalRemainder = (task: IViewTask): number => {
  if (!task.activeSession) {
    return task.msLeftForGoal;
  }
  return task.msLeftForGoal - getSessionDuration(task.activeSession);
}

export const buildTaskHistory = (task: m.ITask, sessionsByDate = {}, today: moment.Moment = moment()): IViewTaskHistory => {
  // Build the current week.
  let date = moment(today).startOf('week');
  let history = {};
  for (var i = 0; i < 7; i++) {
    const dateString = date.format('YYYY-MM-DD');
    history[dateString] = getGoalStatusForDate(task, date, sessionsByDate, today);

    date.add(1, 'day');
  }

  return history;
};

export const getGoalStatusToday = (task: IViewTask) => {
  if (task.goal.type === m.GoalType.NONE) {
    return m.GoalStatus.NO_GOAL;
  }

  const now = moment();

  const dayOfWeek = now.day();
  if (!task.goal.repeats[dayOfWeek]) {
    return m.GoalStatus.NO_GOAL;
  }

  const taskTime = getTaskTime(task);
  const msLeftForGoal = getMillisecondsLeftForGoal(task.goal, taskTime);

  switch (task.goal.type) {
  case m.GoalType.AT_LEAST:
    return msLeftForGoal <= 0 ? m.GoalStatus.PASS : m.GoalStatus.PENDING;

  case m.GoalType.AT_MOST:
    return msLeftForGoal >= 0 ? m.GoalStatus.PASS : m.GoalStatus.FAIL;
  }
}

export const getGoalStatusForDate = (task: m.ITask, date: moment.Moment, sessionsByDate = {}, now = moment()) => {
  if (task.goal.type === m.GoalType.NONE) {
    return m.GoalStatus.NO_GOAL;
  }

  if (date.isAfter(now, 'day')) {
    return m.GoalStatus.FUTURE;
  }

  const dayOfWeek = date.day();
  if (!task.goal.repeats[dayOfWeek]) {
    return m.GoalStatus.NO_GOAL;
  }

  const sessionsById = sessionsByDate[date.format('YYYY-MM-DD')] || {};
  const durationOfAllSessions = sumSessionDurations(
    Object.keys(sessionsById).map(id => sessionsById[id])
  );
  const msLeftForGoal = getMillisecondsLeftForGoal(task.goal, durationOfAllSessions);

  switch (task.goal.type) {
  case m.GoalType.AT_LEAST:
    if (msLeftForGoal <= 0) return m.GoalStatus.PASS;
    if (date.isSame(now, 'day')) return m.GoalStatus.PENDING;
    return m.GoalStatus.FAIL;

  case m.GoalType.AT_MOST:
    if (msLeftForGoal >= 0) return m.GoalStatus.PASS;
    return m.GoalStatus.FAIL;
  }
}

export const getMillisecondsLeftForGoal = (goal: m.IGoal, durationOfSessions: number): number => {
  if (goal.type === m.GoalType.NONE) {
    return 0;
  }
  return goal.duration - durationOfSessions;
}

export const sumSessionDurations = (sessions: m.ISession[] = []): number =>
  sessions.reduce(
    (sum, session) => sum + getSessionDuration(session)
  , 0);

const getSessionDuration = (session: m.ISession): number =>
  (session.stoppedAt || Date.now()) - session.startedAt;
