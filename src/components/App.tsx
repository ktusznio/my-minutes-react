import * as React from 'react';
import { connect } from 'react-redux';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import { startListeningToSessions, stopListeningToSessions } from '../actions/sessions';
import { startListeningToTasks, stopListeningToTasks } from '../actions/tasks';
import { IUser } from '../models';
import { IAppState } from '../reducer';
import { logException } from '../utils/error';

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
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
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
