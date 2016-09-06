import * as React from 'react';
import ActionAlarm from 'material-ui/svg-icons/action/alarm';
import ActionHourglassEmpty from 'material-ui/svg-icons/action/hourglass-empty';

import * as m from '../models';

interface IGoalIconProps {
  goalType: m.GoalType;
  isSelected?: boolean;
}

// Used when passing icons into material-ui's button components so that their
// styling gets applied.
export const buildGoalIcon = (props: IGoalIconProps) => {
  const style = buildStyle(props);

  switch (props.goalType) {
  case m.GoalType.AT_LEAST:
    return <ActionAlarm style={style} />;

  case m.GoalType.AT_MOST:
    return <ActionHourglassEmpty style={style} />;

  default:
    return null;
  }
}

const buildStyle = (props: IGoalIconProps) => ({
  verticalAlign: 'middle',
});
