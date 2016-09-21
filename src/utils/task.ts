import * as moment from 'moment';

import * as c from '../components/theme/colors';
import * as m from '../models';
import { IViewTask, IViewTaskHistory } from '../selectors';
import * as format from './format';

export const getTaskTime = (task: IViewTask): number => {
  if (!task.activeSession) {
    return task.durationOfCompleteSessions;
  }
  return getSessionDuration(task.activeSession) + task.durationOfCompleteSessions;
};

export const getGoalRemainder = (task: IViewTask): number => {
  if (!task.activeSession) {
    return task.msLeftForGoal;
  }
  return task.msLeftForGoal - getSessionDuration(task.activeSession);
}

export const getGoalStatusColor = (task: IViewTask): string => {
  switch (true) {
  case task.goal.type === m.GoalType.AT_LEAST && task.msLeftForGoal <= 0:
    return c.green;

  case task.goal.type === m.GoalType.AT_MOST && task.msLeftForGoal <= 0:
    return c.red;

  default:
    return c.black;
  }
}

export const getGoalMessage = (task: IViewTask) => {
  if (task.goal.type === m.GoalType.NONE || task.goal.duration === 0) {
    return;
  }

  const goalRemainder = getGoalRemainder(task);

  if (task.goal.type === m.GoalType.AT_LEAST) {
    if (goalRemainder > 0) {
      return format.timeRemaining(goalRemainder) + ' to go!'
    } else {
      return 'All done!';
    }
  } else {
    if (goalRemainder > 0) {
      return format.timeRemaining(goalRemainder) + ' left!';
    } else {
      return 'Time\'s up!';
    }
  }
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

  if (date.isBefore(task.createdAt, 'day')) {
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
  const durationOfCompleteSessions = sumSessionDurations(
    Object.keys(sessionsById).map(id => sessionsById[id]),
    true
  );
  const msLeftForGoal = getMillisecondsLeftForGoal(task.goal, durationOfCompleteSessions);

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

export const sumSessionDurations = (sessions: m.ISession[] = [], completeSessionsOnly: boolean = false): number =>
  sessions.reduce(
    (sum, session) => sum + getSessionDuration(session, completeSessionsOnly)
  , 0);

const getSessionDuration = (session: m.ISession, completeSessionOnly: boolean = false): number => {
  if (completeSessionOnly && !session.stoppedAt) {
    return 0;
  }
  return (session.stoppedAt || Date.now()) - session.startedAt;
}
