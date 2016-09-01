import { MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import { startListeningToSessions, stopListeningToSessions } from '../actions/sessions';
import { startListeningToTasks, stopListeningToTasks } from '../actions/tasks';
import { IUser } from '../models';
import { IAppState } from '../reducer';
import { logException } from '../utils/error';
import { muiTheme } from './theme';

interface IAppProps {
  user: IUser;

  startListeningToTasks: (user: IUser) => void;
  stopListeningToTasks: () => void;

  startListeningToSessions: (user: IUser) => void;
  stopListeningToSessions: () => void;
}

const mapStateToProps = (state: IAppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, state: IAppState) => ({
  startListeningToTasks: (user: IUser) => dispatch(startListeningToTasks(user)),
  stopListeningToTasks: () => dispatch(stopListeningToTasks()),

  startListeningToSessions: (user: IUser) => dispatch(startListeningToSessions(user)),
  stopListeningToSessions: () => dispatch(stopListeningToSessions()),
});

class App extends React.Component<IAppProps, {}> {
  componentWillReceiveProps(nextProps: IAppProps) {
    if (nextProps.user && nextProps.user != this.props.user) {
      nextProps.startListeningToTasks(nextProps.user);
      nextProps.startListeningToSessions(nextProps.user);
    }
  }

  componentWillUnmount() {
    this.props.stopListeningToTasks();
    this.props.stopListeningToSessions();
  }

  render() {
    try {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          {React.cloneElement(this.props.children as any, this.props)}
        </MuiThemeProvider>
      );
    } catch (e) {
      logException(e);
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
