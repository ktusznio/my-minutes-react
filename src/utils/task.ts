import { IViewTask } from '../selectors';

export const getTaskTime = (task: IViewTask): number => {
  if (!task.activeSession) {
    return task.durationOfAllSessions;
  }

  const now = Date.now();
  const startedAt = task.activeSession.startedAt;
  return now - startedAt + task.durationOfAllSessions;
};

export const getGoalRemainder = (task: IViewTask): number => {
  if (!task.activeSession) {
    return task.msLeftForGoal;
  }

  const now = (new Date()).getTime();
  const sessionDuration = now - task.activeSession.startedAt;
  return task.msLeftForGoal - sessionDuration;
}
