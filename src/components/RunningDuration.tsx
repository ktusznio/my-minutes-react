import * as React from 'react';

import * as m from '../models';
import { IViewTask } from '../selectors';
import * as format from '../utils/format';
import * as taskUtils from '../utils/task';
import * as c from './theme/colors';

interface IRunningDurationProps {
  task: IViewTask;
  renderGoal?: boolean;
  style?: Object;
}

interface IRunningDurationState {
  interval?: any;
}

export default class RunningDuration extends React.Component<IRunningDurationProps, IRunningDurationState> {
  constructor(props) {
    super(props);

    this.state = {
      interval: this.createInterval(this.props),
    };
  }

  componentWillReceiveProps(nextProps: IRunningDurationProps) {
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

  createInterval(props: IRunningDurationProps): number {
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
    return (
      <span style={this.props.style}>
        {this.renderBody()}
      </span>
    );
  }

  renderBody() {
    if (this.props.renderGoal) {
      return this.renderGoal();
    } else {
      return this.renderTask();
    }
  }

  renderGoal() {
    const goal = this.props.task.goal;
    if (!goal || goal.type === m.GoalType.NONE) {
      return null;
    }

    const goalRemainder = taskUtils.getGoalRemainder(this.props.task);

    let color = c.black;
    let message;
    if (goal.type === m.GoalType.AT_LEAST) {
      if (goalRemainder > 0) {
        message = format.duration(goalRemainder, format.DURATION_H_M) + ' to go!'
      } else {
        color = c.green;
        message = 'All done!';
      }
    } else {
      if (goalRemainder > 0) {
        message = format.duration(goalRemainder, format.DURATION_H_M) + ' left!';
      } else {
        color = c.red;
        message = "Time's up!";
      }
    }

    return (
      <span style={{ color }}>{message}</span>
    );
  }

  renderTask() {
    const taskTime = taskUtils.getTaskTime(this.props.task);

    return (
      <span>{format.duration(taskTime, format.DURATION_H_M_S)}</span>
    );
  }
}
