import test from 'ava';

import * as actionTypes from '../../src/actionTypes'
import { saveTaskError } from '../../src/actions/tasks';

test('returns action', t => {
  const error = new Error;
  t.deepEqual(
    saveTaskError(new Error),
    { type: actionTypes.SAVE_TASK_ERROR, error }
  );
});
