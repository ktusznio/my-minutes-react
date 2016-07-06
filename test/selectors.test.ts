import test from 'ava';

import * as m from '../src/models';
import { taskSelector } from '../src/selectors';

const buildAppState = (partialState) =>
  Object.assign({
    auth: null,
    routing: null,
    sessions: null,
    tasks: null,
  }, partialState)

test('taskSelector', t => {
  const task: m.ITask = m.buildTask({
    name: 'test task',
  });

  const appState = buildAppState({
    tasks: {
      tasks: {
        [task.id]: task,
      },
    },
    sessions: {
      [task.id]: [],
    },
  });

  const expected = Object.assign({}, task, {
    activeSession: null,
    durationOfAllSessions: 0,
    msLeftForGoal: 0,
  });

  t.deepEqual(
    taskSelector(appState, task.id),
    expected
  );
});
