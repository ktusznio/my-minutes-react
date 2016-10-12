import Snackbar from 'material-ui/Snackbar';
import { MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import { startListeningToSessions, stopListeningToSessions } from '../actions/sessions';
import * as snackbarActions from '../actions/snackbar';
import { startListeningToTasks, stopListeningToTasks } from '../actions/tasks';
import * as actionTypes from '../actionTypes';
import { IUser } from '../models';
import { IAppState } from '../reducer';
import NoConnectionScreen from './NoConnectionScreen';
import muiTheme from './theme/muiTheme';

interface IAppProps {
  isOnline: boolean;
  user: IUser;

  startListeningToTasks: (user: IUser) => void;
  stopListeningToTasks: () => void;

  startListeningToSessions: (user: IUser) => void;
  stopListeningToSessions: () => void;

  isSnackbarOpen: boolean;
  snackbarMessage: string;
  onSnackbarClose: () => void;
}

interface _IAppState {
  isSnackbarOpen?: boolean;
  wasEverOnline?: boolean;
}

const SNACKBAR_AUTO_HIDE_DURATION = 4000;

const mapStateToProps = (state: IAppState) => ({
  isOnline: state.connection.isOnline,
  isSnackbarOpen: state.snackbar.isOpen,
  snackbarMessage: state.snackbar.message,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, state: IAppState) => ({
  startListeningToTasks: (user: IUser) => dispatch(startListeningToTasks(user)),
  stopListeningToTasks: () => dispatch(stopListeningToTasks()),

  startListeningToSessions: (user: IUser) => dispatch(startListeningToSessions(user)),
  stopListeningToSessions: () => dispatch(stopListeningToSessions()),

  onSnackbarClose: () => dispatch(snackbarActions.dismissMessage()),
});

class App extends React.Component<IAppProps, _IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      isSnackbarOpen: this.props.isSnackbarOpen,
      wasEverOnline: this.props.isOnline,
    };
  }

  componentWillReceiveProps(nextProps: IAppProps) {
    if (nextProps.isOnline) {
      this.setState({ wasEverOnline: true });
    }

    if ((this.state.wasEverOnline || nextProps.isOnline) && nextProps.user && nextProps.user != this.props.user) {
      nextProps.startListeningToTasks(nextProps.user);
      nextProps.startListeningToSessions(nextProps.user);
    }

    this.setState({ isSnackbarOpen: nextProps.isSnackbarOpen });
  }

  componentWillUnmount() {
    this.props.stopListeningToTasks();
    this.props.stopListeningToSessions();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          {this.renderBody()}
          {this.renderSnackbar()}
        </div>
      </MuiThemeProvider>
    );
  }

  renderBody() {
    if (this.state.wasEverOnline) {
      return React.cloneElement(this.props.children as any, this.props);
    } else {
      return <NoConnectionScreen />
    }
  }

  renderSnackbar() {
    let action, onActionTouchTap;
    let message = this.props.snackbarMessage;

    if (this.props.snackbarMessage === actionTypes.POST_SNACKBAR_APP_UPDATE_AVAILABLE) {
      action = 'Restart Now';
      message = 'A new version of My Minutes is available.';
      onActionTouchTap = () => window.location.reload()
    }

    return (
      <Snackbar
        action={action}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
        message={message}
        open={this.state.isSnackbarOpen}
        onActionTouchTap={onActionTouchTap}
        onRequestClose={this.props.onSnackbarClose}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
