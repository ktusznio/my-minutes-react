import * as m from '../models';

export const tasks = (uid: m.UserId) =>
  `/tasks/${uid}`

export const task = (uid: m.UserId, taskId: m.TaskId) =>
  `/tasks/${uid}/${taskId}`

export const taskSessions = (uid: m.UserId, taskId: m.TaskId, date: string) =>
  `/sessions/${uid}/${taskId}/${date}`

export const sessions = (uid: m.UserId) =>
  `/sessions/${uid}`
