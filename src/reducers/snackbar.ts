import * as actionTypes from '../actionTypes';

export interface ISnackbarState {
  isOpen: boolean;
  message: string;
}

export default function snackbar(
  snackbarState: ISnackbarState = { isOpen: false, message: '' },
  action
): ISnackbarState {
  switch (action.type) {
  case actionTypes.DISMISS_SNACKBAR_MESSAGE:
    return {
      isOpen: false,
      message: '',
    };

  case actionTypes.POST_SNACKBAR_MESSAGE:
    return {
      isOpen: true,
      message: action.message,
    };

  case actionTypes.POST_SNACKBAR_APP_UPDATE_AVAILABLE:
    return {
      isOpen: true,
      message: actionTypes.POST_SNACKBAR_APP_UPDATE_AVAILABLE,
    };

  default:
    return snackbarState;
  }
}
