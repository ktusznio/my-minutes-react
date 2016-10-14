import test from 'ava';
import * as moment from 'moment';

import * as m from '../../src/models';
import { IViewTask, IViewTaskHistory } from '../../src/selectors';
import * as taskUtils from '../../src/utils/task';

const today = moment('2016-08-19');
const createdAt = moment('2016-08-14');

const task: IViewTask = {
  id: 'test-task',
  createdAt: createdAt.valueOf(),
  name: 'Test',
  state: m.TaskState.STOPPED,
  goal: {
    type: m.GoalType.AT_LEAST,
    duration: 60 * 1000, // 1 minute
    repeats: [true, true, true, true, true, true, true],
  },
  currentSessionPath: '',

  activeSession: null,
  durationOfCompleteSessions: 0,
  history: null,
  msLeftForGoal: 60 * 1000, // 1 minute
};

const sessionsByDate = {
  '2016-08-16': {
    'fail-because-only-30-seconds': {
      startedAt: 0,
      stoppedAt: 1000 * 30,
    },
  },
  '2016-08-17': {
    'pass-because...': {
      startedAt: 0,
      stoppedAt: 1000 * 30,
    },
    '...combined-minute': {
      startedAt: 0,
      stoppedAt: 1000 * 30,
    },
  },
};

test('buildTaskHistory', t => {
  const result = taskUtils.buildTaskHistory(
    task,
    sessionsByDate,
    today,
  );
  const expected: IViewTaskHistory = {
    '2016-08-14': m.GoalStatus.FAIL,
    '2016-08-15': m.GoalStatus.FAIL,
    '2016-08-16': m.GoalStatus.FAIL,
    '2016-08-17': m.GoalStatus.PASS,
    '2016-08-18': m.GoalStatus.FAIL,
    '2016-08-19': m.GoalStatus.PENDING,
    '2016-08-20': m.GoalStatus.FUTURE,
  };

  t.deepEqual(result, expected);
});
