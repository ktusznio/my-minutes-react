import * as moment from 'moment';
import * as React from 'react';

import * as m from '../models';
import { IViewTask } from '../selectors';
import * as taskUtils from '../utils/task';
import * as c from './theme/colors';
import Interval from './Interval';

interface ITaskHistoryDotsProps {
  task: IViewTask;
}

const buildDotStylesForTask = (task: IViewTask) => {
  const dotStyles = buildBaseDotStyles();
  const day = moment().startOf('week');
  const now = moment();

  return dotStyles.map(dotStyle => {
    const goalStatus = now.isSame(day, 'day')
      ? taskUtils.getGoalStatusToday(task)
      : task.history[day.format('YYYY-MM-DD')];
    const statusStyle = style[`dot:goal-status-${goalStatus}`];

    day.add(1, 'day');

    return Object.assign({}, dotStyle, statusStyle);
  });
}

const buildBaseDotStyles = () => {
  return [
    Object.assign({}, style.dot, style.dot['dot:first-child']),
    Object.assign({}, style.dot),
    Object.assign({}, style.dot),
    Object.assign({}, style.dot),
    Object.assign({}, style.dot),
    Object.assign({}, style.dot),
    Object.assign({}, style.dot, style.dot['dot:last-child']),
  ];
}

class TaskHistoryDots extends React.Component<ITaskHistoryDotsProps, {}> {
  render() {
    const { task } = this.props;
    const dotStyles = buildDotStylesForTask(task);

    return (
      <div style={style.root}>
        <div style={dotStyles[0]}><span style={style.dotSpan}>S</span></div>
        <div style={dotStyles[1]}><span style={style.dotSpan}>M</span></div>
        <div style={dotStyles[2]}><span style={style.dotSpan}>T</span></div>
        <div style={dotStyles[3]}><span style={style.dotSpan}>W</span></div>
        <div style={dotStyles[4]}><span style={style.dotSpan}>T</span></div>
        <div style={dotStyles[5]}><span style={style.dotSpan}>F</span></div>
        <div style={dotStyles[6]}><span style={style.dotSpan}>S</span></div>
      </div>
    );
  }
}

const style = {
  root: {
    display: 'flex',
    padding: '18px 0',
  },
  dot: {
    alignItems: 'center',
    background: `1px solid ${c.greyTransparent}`,
    borderRadius: '50%',
    color: c.white,
    display: 'flex',
    fontSize: '10px',
    lineHeight: '10px',
    height: '20px',
    justifyContent: 'center',
    margin: '0 4px',
    width: '20px',
  },
  'dot:first-child': {
    margin: '0 4px 0 0',
  },
  'dot:last-child': {
    margin: '0 0px 0 4px',
  },
  [`dot:goal-status-${m.GoalStatus.NO_GOAL}`]: {
    background: c.grey,
  },
  [`dot:goal-status-${m.GoalStatus.PENDING}`]: {
    background: c.blue,
  },
  [`dot:goal-status-${m.GoalStatus.PASS}`]: {
    background: c.green,
  },
  [`dot:goal-status-${m.GoalStatus.FAIL}`]: {
    background: c.red,
  },
  [`dot:goal-status-${m.GoalStatus.FUTURE}`]: {
    background: c.greyTransparent,
  },
  dotSpan: {
    paddingTop: '1px',
  },
};

export default Interval(TaskHistoryDots);
