import * as actionTypes from '../actionTypes';

export const postMessage = (message: string) => ({
  type: actionTypes.POST_SNACKBAR_MESSAGE,
  message,
});

export const postAppUpdateAvailable = () => ({
  type: actionTypes.POST_SNACKBAR_APP_UPDATE_AVAILABLE,
})
