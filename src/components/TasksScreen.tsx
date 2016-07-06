import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Dialog, FlatButton, FloatingActionButton, TextField } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { saveTask } from '../actions/tasks';
import * as db from '../firebase/database';
import * as m from '../models';
import { IAppState } from '../reducer';
import { getTasks } from '../reducers/tasks';
import { tasksSelector, viewTaskToTask, IViewTask } from '../selectors';
import * as push from '../utils/push';
import * as routes from '../utils/routes';
import Navigation from './Navigation';
import { Screen, ScreenContent } from './Screen';
import TaskList from './TaskList';

export interface ITasksScreenProps {
  onAddTask: ((task: m.ITask) => void);
  onSendPush: () => void;
  tasks: IViewTask[];
  user: m.IUser;
}

interface ITasksScreenState {
  isAddTaskDialogOpen: boolean;
}

const mapStateToProps = (state: IAppState) => ({
  tasks: tasksSelector(state),
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, props: ITasksScreenProps) => ({
  onAddTask: (task: m.ITask) => {
    dispatch(saveTask(viewTaskToTask(task))).then((task: m.ITask) => {
      browserHistory.push(routes.task(task.id));
    });
  },

  onSendPush: () => {
    const message = {
      payload: {
        title: 'My Minutes',
        body: 'Way to go!',
      },
    };
    push.sendPush(props.user.uid, message);
  },
});

class TasksScreen extends React.Component<ITasksScreenProps, ITasksScreenState> {
  refs: {
    [name: string]: any;
    taskName: TextField;
  }

  constructor(props) {
    super(props);
    this.state = {
      isAddTaskDialogOpen: false,
    };
  }

  openAddTaskDialog = () =>
    this.setState({ isAddTaskDialogOpen: true })

  closeAddTaskDialog = () =>
    this.setState({ isAddTaskDialogOpen: false })

  handleAddTaskDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = this.refs.taskName.getValue();
    const task = m.buildTask({ name });
    this.props.onAddTask(task);
    this.closeAddTaskDialog();
  };

  sendPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.onSendPush();
  }

  render() {
    const addTaskDialogActions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.closeAddTaskDialog}
      />,
      <FlatButton
        label="Add Task"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.handleAddTaskDialogSubmit}
      />,
    ];

    return (
      <Screen>
        <Navigation title="My Minutes" />
        <ScreenContent>
          <button onTouchTap={this.sendPushNotification}>Send Push</button>
          <TaskList tasks={this.props.tasks} />
        </ScreenContent>

        <div style={{ position: 'fixed', right: '4%', bottom: '2.5%' }}>
          <FloatingActionButton onTouchTap={this.openAddTaskDialog}>
            <ContentAdd />
          </FloatingActionButton>
        </div>

        <Dialog
          title="Add a task"
          actions={addTaskDialogActions}
          open={this.state.isAddTaskDialogOpen}
          onRequestClose={this.closeAddTaskDialog}>
          <TextField
            ref="taskName"
            hintText="Task name"
          />
        </Dialog>
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksScreen);
