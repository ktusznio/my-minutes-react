import { MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import { startListeningToSessions, stopListeningToSessions } from '../actions/sessions';
import { startListeningToTasks, stopListeningToTasks } from '../actions/tasks';
import { IUser } from '../models';
import { IAppState } from '../reducer';
import { logException } from '../utils/error';
import NoConnectionScreen from './NoConnectionScreen';
import { muiTheme } from './theme';

interface IAppProps {
  isOnline: boolean;
  user: IUser;

  startListeningToTasks: (user: IUser) => void;
  stopListeningToTasks: () => void;

  startListeningToSessions: (user: IUser) => void;
  stopListeningToSessions: () => void;
}

interface _IAppState {
  wasEverOnline: boolean;
}

const mapStateToProps = (state: IAppState) => ({
  isOnline: state.connection.isOnline,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, state: IAppState) => ({
  startListeningToTasks: (user: IUser) => dispatch(startListeningToTasks(user)),
  stopListeningToTasks: () => dispatch(stopListeningToTasks()),

  startListeningToSessions: (user: IUser) => dispatch(startListeningToSessions(user)),
  stopListeningToSessions: () => dispatch(stopListeningToSessions()),
});

class App extends React.Component<IAppProps, _IAppState> {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  componentWillUnmount() {
    this.props.stopListeningToTasks();
    this.props.stopListeningToSessions();
  }

  render() {
    try {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          {this.renderBody()}
        </MuiThemeProvider>
      );
    } catch (e) {
      logException(e);
    }
  }

  renderBody() {
    if (this.state.wasEverOnline) {
      return React.cloneElement(this.props.children as any, this.props);
    } else {
      return <NoConnectionScreen />
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
