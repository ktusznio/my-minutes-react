import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { saveTask } from '../actions/tasks';
import * as db from '../firebase/database';
import * as m from '../models';
import { IAppState } from '../reducer';
import { getTasks } from '../reducers/tasks';
import { tasksSelector, viewTaskToTask, IViewTask } from '../selectors';
import * as routes from '../utils/routes';
import AddTaskDialog from './AddTaskDialog';
import Navigation from './Navigation';
import { Screen, ScreenContent } from './Screen';
import TaskList from './TaskList';

export interface ITasksScreenProps {
  onAddTask: ((task: m.ITask) => void);
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
});

class TasksScreen extends React.Component<ITasksScreenProps, ITasksScreenState> {
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

  handleAddTaskDialogSubmit = (name: string) => {
    const task = m.buildTask({ name });
    this.props.onAddTask(task);
    this.closeAddTaskDialog();
  };

  render() {
    return (
      <Screen>
        <Navigation title="My Minutes" />

        <ScreenContent>
          <TaskList tasks={this.props.tasks} />
        </ScreenContent>

        <div style={{ position: 'fixed', right: '4%', bottom: '2.5%' }}>
          <FloatingActionButton onTouchTap={this.openAddTaskDialog}>
            <ContentAdd />
          </FloatingActionButton>
        </div>

        <AddTaskDialog
          isOpen={this.state.isAddTaskDialogOpen}
          onRequestClose={this.closeAddTaskDialog}
          onSubmit={this.handleAddTaskDialogSubmit}
        />
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksScreen);
