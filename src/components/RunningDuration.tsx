import * as React from 'react';

import * as m from '../models';
import { IViewTask } from '../selectors';
import * as format from '../utils/format';
import * as taskUtils from '../utils/task';
import { buildGoalIcon } from './GoalIcon';
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
          {format.timeTracked(taskTime)}
        </span>
      );
    }
  }
);

export const RunningGoalDuration = Interval(
  class extends React.Component<IRunningDurationProps, {}> {
    render() {
      const task = this.props.task;
      if (!task.goal || task.goal.type === m.GoalType.NONE || task.goal.duration === 0) {
        return null;
      }

      const color = taskUtils.getGoalStatusColor(task);
      const message = taskUtils.getGoalMessage(task);
      const goalIcon = buildGoalIcon({ task });

      return (
        <div style={style.RunningGoalDuration.root}>
          {goalIcon}
          <span style={Object.assign({}, this.props.style, { color })}>
            {message}
          </span>
        </div>
      );
    }
  }
);

const style = {
  RunningGoalDuration: {
    root: {
      alignItems: 'center',
      display: 'flex',
    },
  },
}
