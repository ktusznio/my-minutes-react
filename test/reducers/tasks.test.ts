import test from 'ava';

import store from '../../src/store';
import tasks from '../../src/reducers/tasks';
import { startListeningToTasks } from '../../src/actions/tasks';

const user = { uid: 'test-uid' };

test('listening to tasks sets ref and listener', t => {
  const unsubscribe = store.subscribe(() => {
    t.truthy(store.getState().tasks.tasksRef);
    t.truthy(store.getState().tasks.tasksListener);
    unsubscribe();
  });

  startListeningToTasks(user)(store.dispatch);
});
