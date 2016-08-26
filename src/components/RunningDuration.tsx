import * as React from 'react';

import * as m from '../models';
import { IViewTask } from '../selectors';
import * as format from '../utils/format';
import * as taskUtils from '../utils/task';
import Interval from './Interval';
import * as c from './theme/colors';

interface IRunningDurationProps {
  task: IViewTask;
  style?: Object;
}

export const RunningTaskDuration = Interval(
  class extends React.Component<IRunningDurationProps, {}> {
    render() {
      const taskTime = taskUtils.getTaskTime(this.props.task);

      return (
        <span style={this.props.style}>
          {format.duration(taskTime, format.DURATION_H_M_S)}
        </span>
      );
    }
  }
);

export const RunningGoalDuration = Interval(
  class extends React.Component<IRunningDurationProps, {}> {
    render() {
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
        <span style={Object.assign({}, this.props.style, { color })}>
          {message}
        </span>
      );
    }
  }
);
