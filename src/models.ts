import { cloneDeep } from 'lodash';

// Push payload.

export interface IPushPayload {
  title: string;
  body: string;
}

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
  name: string;
  state: TaskState;
  goal: IGoal;
  currentSessionPath: string;
};

export const buildTask = (props: ITaskProps = {}): ITask => ({
  id: undefined,
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

export const GOAL_REPEATS_DEFAULT = [false, false, false, false, false, false, false];
export const GOAL_MAX_DURATION = 24 * 60 * 60 * 1000;

export const buildGoal = (props: IGoalProps = {}): IGoal =>
  Object.assign({
    duration: 0,
    type: GoalType.NONE,
    repeats: GOAL_REPEATS_DEFAULT,
  }, props)
