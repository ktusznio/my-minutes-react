import * as React from 'react';
import ActionAlarm from 'material-ui/svg-icons/action/alarm';
import ActionHourglassEmpty from 'material-ui/svg-icons/action/hourglass-empty';

import * as m from '../models';
import { IViewTask } from '../selectors';
import * as taskUtils from '../utils/task';
import * as c from './theme/colors';

interface IGoalIconProps {
  task?: IViewTask;
  goalType?: m.GoalType;
  isSelected?: boolean;
}

// Used when passing icons into material-ui's button components so that the
// icon has its styling applied.
export const buildGoalIcon = (props: IGoalIconProps) => {
  const task = props.task;
  const goalType = props.goalType || (task && task.goal.type);

  if (goalType === m.GoalType.NONE || (task && task.goal.duration === 0)) {
    return null;
  }

  const style = buildStyle(props);

  switch (goalType) {
  case m.GoalType.AT_LEAST:
    return <ActionAlarm style={Object.assign({}, style, { paddingRight: '4px' })} color={style.color} />;

  case m.GoalType.AT_MOST:
    return <ActionHourglassEmpty style={style} color={style.color} />;

  default:
    return null;
  }
}

const buildStyle = (props: IGoalIconProps) => ({
  color: getGoalIconColor(props),
  verticalAlign: 'middle',
});

const getGoalIconColor = (props: IGoalIconProps) => {
  if (props.isSelected) {
    return c.blue;
  }

  if (props.task) {
    return taskUtils.getGoalStatusColor(props.task);
  }

  return c.black;
}
