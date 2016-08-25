import * as React from 'react';
import { connect } from 'react-redux';

import { startTask, stopTask } from '../actions/tasks';
import * as m from '../models';
import { IAppState } from '../reducer';
import { RouteParams } from '../router';
import { taskSelector, IViewTask } from '../selectors';
import { Column } from './Flex';
import Navigation from './Navigation';
import NavigationBackIcon from './NavigationBackIcon';
import { RunningTaskDuration, RunningGoalDuration } from './RunningDuration';
import { Screen, ScreenContent } from './Screen';
import StartTaskButton from './StartTaskButton';
import TaskHistoryDots from './TaskHistoryDots';

export interface IRunningTaskScreenProps {
  task: IViewTask;
  startTask: ((task: IViewTask) => void);
  stopTask: ((task: IViewTask) => void);
  params: RouteParams;
}

interface IRunningTaskScreenState {
  interval?: any;
}

const mapStateToProps = (state: IAppState, props: IRunningTaskScreenProps) => ({
  task: taskSelector(state, props.params.taskId),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  startTask: (task: IViewTask) => dispatch(startTask(task)),
  stopTask: (task: IViewTask) => dispatch(stopTask(task)),
});

class RunningTaskScreen extends React.Component<IRunningTaskScreenProps, IRunningTaskScreenState> {
  constructor(props) {
    super(props);
    this.state = {
      interval: this.createInterval(this.props),
    };
  }

  componentWillReceiveProps(nextProps: IRunningTaskScreenProps) {
    if (!this.state.interval && nextProps.task.activeSession) {
      const interval = this.createInterval(nextProps);
      this.setState({ interval });
    }

    if (!nextProps.task.activeSession) {
      this.clearInterval();
    }
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  createInterval(props: IRunningTaskScreenProps): number {
    if ((!this.state || !this.state.interval) && props.task.activeSession) {
      return setInterval(this.forceUpdate.bind(this), 50);
    }
  }

  clearInterval() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: null });
    }
  }

  render() {
    const { task } = this.props;
    return (
      <Screen>
        <Navigation
          leftIcon={<NavigationBackIcon />}
          title={task.name}
        />
        <ScreenContent style={{ height: '100%' }}>
          <Column style={{ flex: 1 }}>
            <RunningTaskDuration style={style.task} task={task} />
            <RunningGoalDuration style={style.goal} task={task} />
          </Column>
          <div style={{ flex: 1, margin: '40px auto 0' }}>
            <StartTaskButton task={task} />
            <TaskHistoryDots task={task} />
          </div>
        </ScreenContent>
      </Screen>
    );
  }
};

const style = {
  task: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '40px auto 0',
  },
  goal: {
    fontSize: '16px',
    margin: '10px auto 0',
  },
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunningTaskScreen);
