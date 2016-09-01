import * as React from 'react';
import { connect } from 'react-redux';
import { Dialog, FlatButton, TextField } from 'material-ui';
import { browserHistory } from 'react-router';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import { cloneDeep } from 'lodash';

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
  taskDraft?: IViewTask;
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
    this.state = Object.assign(this.buildStateFromProps(props), {
      isDeleteTaskDialogOpen: false,
    });
  }

  componentWillReceiveProps(nextProps: ITaskScreenProps) {
    this.setState(this.buildStateFromProps(nextProps));
  }

  hasReceivedFetchedTask = (): boolean => !!this.props.task.id

  buildStateFromProps = (props: ITaskScreenProps) => ({
    taskDraft: cloneDeep(props.task),
  })

  handleBack = (e: React.TouchEvent) => {
    e.preventDefault();

    if (!this.hasReceivedFetchedTask) {
      return;
    }

    let duration = this.refs.duration.getMilliseconds();
    if (duration > m.GOAL_MAX_DURATION) {
      duration = this.props.task.goal.duration;
    }

    const task: m.ITask = Object.assign({}, this.props.task, {
      name: this.state.taskDraft.name || this.props.task.name,
      goal: Object.assign({}, this.props.task.goal, {
        type: this.state.taskDraft.goal.type,
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

  setTaskDraft(newDraft: IViewTask) {
    this.setState({ taskDraft: newDraft });
  }

  setName(name: string) {
    const newDraft = Object.assign({}, this.state.taskDraft, { name });
    this.setState({ taskDraft: newDraft });
  }

  setGoalType(type: m.GoalType) {
    const taskDraft = this.state.taskDraft;
    const newDraft = Object.assign({}, taskDraft, {
      goal: Object.assign({}, taskDraft.goal, {
        type,
      }),
    });
    this.setState({ taskDraft: newDraft })
  }

  getErrorText(inputName: string, isValid: boolean): string {
    if (!this.hasReceivedFetchedTask()) {
      return '';
    }
    if (!isValid) {
      return errorTexts[inputName];
    }
    return '';
  }

  render() {
    const task = this.state.taskDraft;

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

    return (
      <Screen>
        <Navigation
          leftIcon={backIcon}
          title={task.name}
        />
        <ScreenContent>
          <div style={style.formRow}>
            <Label text="Task name" />
            <TextField
              ref="taskName"
              name="taskName"
              value={task.name}
              fullWidth={true}
              errorText={this.getErrorText('taskName', !!task.name)}
              onChange={e => this.setName((e.target as any).value)}
            />
          </div>
          <div style={style.formRow}>
            <Label text="Goal" style={style.formLabel} />
            <Row>
              <FlatButton
                style={style.goalTypeButton}
                ref="noGoalButton"
                label="None"
                primary={task.goal.type === m.GoalType.NONE}
                onTouchTap={() => this.setGoalType(m.GoalType.NONE)}
              />
              <FlatButton
                style={style.goalTypeButton}
                ref="atMostButton"
                label="At Least"
                primary={this.state.taskDraft.goal.type === m.GoalType.AT_LEAST}
                onTouchTap={() => this.setGoalType(m.GoalType.AT_LEAST)}
              />
              <FlatButton
                style={style.goalTypeButton}
                ref="atMostButton"
                label="At Most"
                primary={this.state.taskDraft.goal.type === m.GoalType.AT_MOST}
                onTouchTap={() => this.setGoalType(m.GoalType.AT_MOST)}
              />
            </Row>
          </div>
          <div style={style.formRow}>
            <Label text="Duration" style={style.formLabel} />
            <DurationInput
              ref="duration"
              defaultDuration={task.goal.duration}
              disabled={task.goal.type === m.GoalType.NONE}
            />
          </div>
          <div style={style.formRow}>
            <Label text="Repeats" style={Object.assign({}, style.formLabel, { marginBottom: '8px' })} />
            <RepeatSelect
              ref="repeat"
              repeats={task.goal.repeats}
              disabled={task.goal.type === m.GoalType.NONE}
            />
          </div>
          <div style={Object.assign({}, style.formRow, { margin: `0 auto ${style.formRow.marginBottom} auto` })}>
            <FlatButton
              style={style.deleteTaskButton}
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

const style = {
  formRow: {
    marginBottom: '25px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '4px',
  },
  goalTypeButton: {
    flex: 1,
  },
  deleteTaskButton: {
    flex: 1,
  },
};

const errorTexts = {
  taskName: 'Please, give me a name!',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskScreen);
