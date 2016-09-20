const CONNECTION = 'connection';
export const CONNECTION_CHANGED = CONNECTION + '/changed';

const AUTH = 'auth';
export const ATTEMPT_LOGIN = AUTH + '/attempt-login';
export const ACCOUNT_EXISTS = AUTH + '/account-exists';
export const LOGIN_SUCCESS = AUTH + '/login-success';
export const LOGOUT = AUTH + '/logout';

const TASKS = 'tasks';
export const LISTEN_TO_TASKS = TASKS + '/listen';
export const STOP_LISTENING_TO_TASKS = TASKS + '/stop-listening';
export const TASK_ADDED = TASKS + '/added';
export const TASK_CHANGED = TASKS + '/changed';
export const TASK_REMOVED = TASKS + '/removed';

export const SAVE_TASK_ERROR = TASKS + '/save-error';
export const START_TASK_ERROR = TASKS + '/start-error';
export const STOP_TASK_ERROR = TASKS + '/stop-error';
export const PAUSE_TASK_ERROR = TASKS + '/pause-error';
export const DELETE_TASK_ERROR = TASKS + '/delete-error';

const SESSIONS = 'sessions';
export const LISTEN_TO_SESSIONS = SESSIONS + '/listen';
export const STOP_LISTENING_TO_SESSIONS = SESSIONS + '/stop-listening';
export const SESSION_ADDED = SESSIONS + '/added';
export const SESSION_CHANGED = SESSIONS + '/changed';
export const SESSION_REMOVED = SESSIONS + '/removed';
