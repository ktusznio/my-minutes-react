import * as React from 'react';
import { connect } from 'react-redux';
import { Dialog, FlatButton, TextField } from 'material-ui';
import { browserHistory } from 'react-router';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import { saveTask, deleteTask } from '../actions/tasks';
import * as m from '../models';
import { RouteParams } from '../router';
import { IAppState } from '../reducer';
import { taskSelector, viewTaskToTask, IViewTask } from '../selectors';
import DurationInput from './DurationInput';
import RepeatSelect from './RepeatSelect';
import { Row } from './Flex';
import Label from './Label';
import Navigation from './Navigation';
import NavigationBackIcon from './NavigationBackIcon';
import { Screen, ScreenContent } from './Screen';

export interface ITaskScreenProps {
  task: IViewTask;
  onDeleteTask: (task: m.ITask) => void;
  onSubmit: ((task: m.ITask) => void);
  params: RouteParams;
}

interface ITaskScreenState {
  isDeleteTaskDialogOpen?: boolean;
  goalType?: m.GoalType,
  taskName?: string;
}

const mapStateToProps = (state: IAppState, props: ITaskScreenProps) => ({
  task: taskSelector(state, props.params.taskId),
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteTask: (task: m.ITask) => {
    dispatch(deleteTask(task)).catch(
      e => console.error('error deleting task', e, task)
    );
    browserHistory.goBack();
  },
  onSubmit: (task: IViewTask) => {
    dispatch(saveTask(viewTaskToTask(task))).catch(
      e => console.error('error saving task', e, task)
    );
    browserHistory.goBack();
  },
});

export class TaskScreen extends React.Component<ITaskScreenProps, ITaskScreenState> {
  refs: {
    [name: string]: any;
    form: HTMLFormElement;
    taskName: TextField;
    duration: DurationInput;
    repeat: RepeatSelect;
  }

  constructor(props: ITaskScreenProps) {
    super(props);
    this.state = {
      isDeleteTaskDialogOpen: false,
      goalType: this.props.task.goal.type,
      taskName: this.props.task.name,
    };
  }

  handleBack = (e: React.TouchEvent) => {
    e.preventDefault();

    let duration = this.refs.duration.getMilliseconds();
    if (duration > m.GOAL_MAX_DURATION) {
      duration = this.props.task.goal.duration;
    }

    const task: m.ITask = Object.assign({}, this.props.task, {
      name: this.state.taskName || this.props.task.name,
      goal: Object.assign({}, this.props.task.goal, {
        type: this.state.goalType,
        duration,
        repeats: this.refs.repeat.getRepeats(),
      })
    });

    this.props.onSubmit(task);
  };

  openDeleteTaskDialog = () =>
    this.setState({ isDeleteTaskDialogOpen: true });
  closeDeleteTaskDialog = () =>
    this.setState({ isDeleteTaskDialogOpen: false });

  render() {
    const { task } = this.props;

    const backIcon = (
      <NavigationBackIcon onTouchTap={this.handleBack} />
    );

    const deleteTaskDialogActions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.closeDeleteTaskDialog}
      />,
      <FlatButton
        label="Delete Task"
        primary={true}
        keyboardFocused={false}
        onTouchTap={() => this.props.onDeleteTask(task)}
      />,
    ];

    const sectionMarginBottom = '25px';

    return (
      <Screen>
        <Navigation
          leftIcon={backIcon}
          title={task.name}
        />
        <ScreenContent>
          <div style={{ marginBottom: sectionMarginBottom }}>
            <Label text="Task name" />
            <TextField
              ref="taskName"
              name="taskName"
              value={this.state.taskName}
              fullWidth={true}
              errorText={!this.state.taskName ? 'Please, give me a name!' : ''}
              onChange={e => this.setState({ taskName: (e.target as any).value })}
            />
          </div>
          <div style={{ marginBottom: sectionMarginBottom }}>
            <Label text="Goal" style={{ display: 'block', marginBottom: '4px' }} />
            <Row>
              <FlatButton
                style={{ flex: 1 }}
                ref="noGoalButton"
                label="None"
                primary={this.state.goalType === m.GoalType.NONE}
                onTouchTap={() => { this.setState({ goalType: m.GoalType.NONE })}}
              />
              <FlatButton
                style={{ flex: 1 }}
                ref="atMostButton"
                label="At Least"
                primary={this.state.goalType === m.GoalType.AT_LEAST}
                onTouchTap={() => { this.setState({ goalType: m.GoalType.AT_LEAST })}}
              />
              <FlatButton
                style={{ flex: 1 }}
                ref="atMostButton"
                label="At Most"
                primary={this.state.goalType === m.GoalType.AT_MOST}
                onTouchTap={() => { this.setState({ goalType: m.GoalType.AT_MOST })}}
              />
            </Row>
          </div>
          <div style={{ marginBottom: sectionMarginBottom }}>
            <Label text="Duration" style={{ display: 'block', marginBottom: '4px' }} />
            <DurationInput
              ref="duration"
              defaultDuration={task.goal.duration}
              disabled={this.state.goalType === m.GoalType.NONE}
            />
          </div>
          <div style={{ marginBottom: sectionMarginBottom }}>
            <Label text="Repeats" style={{ display: 'block', marginBottom: '8px' }} />
            <RepeatSelect
              ref="repeat"
              repeats={task.goal.repeats}
              disabled={this.state.goalType === m.GoalType.NONE}
            />
          </div>
          <div style={{ margin: `0 auto ${sectionMarginBottom} auto` }}>
            <FlatButton
              style={{ flex: '1' }}
              label="Delete Task"
              secondary={true}
              onTouchTap={this.openDeleteTaskDialog}
            />
          </div>
        </ScreenContent>

        <Dialog
          title="Delete task"
          actions={deleteTaskDialogActions}
          open={this.state.isDeleteTaskDialogOpen}
          onRequestClose={this.closeDeleteTaskDialog}>
          Are you sure you want to delete this task? All task data will be lost.
        </Dialog>
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskScreen);
