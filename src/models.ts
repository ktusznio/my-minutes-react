import * as firebaseClient from './firebase';

// User.

export type UserId = string;

export interface IUser {
  uid: UserId;
}

// Task.

export type TaskId = string;

interface ITaskProps {
  name?: string;
  goal?: IGoal;
}

export const enum TaskState {
  STOPPED,
  RUNNING,
  PAUSED,
}

export interface ITask {
  id: TaskId;
  createdAt: number;
  name: string;
  state: TaskState;
  goal: IGoal;
  currentSessionPath: string;
};

export const buildTask = (props: ITaskProps = {}): ITask => ({
  id: undefined,
  createdAt: firebaseClient.SERVER_TIMESTAMP,
  name: props.name || '',
  state: TaskState.STOPPED,
  goal: buildGoal(props.goal),
  currentSessionPath: null,
});

// Session.

export type SessionId = string;

export class ISession {
  startedAt: number;
  stoppedAt: number;
}

// Goal.

export const enum GoalType {
  NONE,
  AT_LEAST,
  AT_MOST,
}

export const enum GoalStatus {
  NO_GOAL,
  PENDING,
  PASS,
  FAIL,
  FUTURE,
}

export interface IGoal {
  duration: number;
  type: GoalType;
  repeats: Array<boolean>;
}

interface IGoalProps {
  duration?: number;
  type?: GoalType;
  repeats?: Array<boolean>;
}

export const GOAL_DURATION_DEFAULT = 30 * 60 * 1000; // 30 mins.
export const GOAL_MAX_DURATION = 24 * 60 * 60 * 1000; // 24 hours.
export const GOAL_REPEATS_DEFAULT = [true, true, true, true, true, true, true];

export const buildGoal = (props: IGoalProps = {}): IGoal =>
  Object.assign({
    duration: GOAL_DURATION_DEFAULT,
    type: GoalType.AT_LEAST,
    repeats: GOAL_REPEATS_DEFAULT,
  }, props)
