import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import * as c from './theme/colors';
import * as m from '../models';
import { IViewTask } from '../selectors';
import { IAppState } from '../reducer';
import * as routes from '../utils/routes';
import * as format from '../utils/format';
import { RunningTaskDuration, RunningGoalDuration } from './RunningDuration';
import StartTaskButton from './StartTaskButton';
import TaskHistoryDots from './TaskHistoryDots';
import theme from './theme';

export interface ITaskListItemProps {
  task: IViewTask;
}

const handleStartTask = (task: m.ITask) =>
  browserHistory.push(routes.runningTask(task.id))

const TaskListItem = (props: ITaskListItemProps) => {
  const { task } = props;
  return (
    <div style={style.root}>
      <Link style={style.leftColumn} to={routes.task(task.id)}>
        <div style={style.taskName}>{task.name}</div>
        <TaskHistoryDots active={!!task.activeSession} task={task} />
        <RunningTaskDuration active={!!task.activeSession} task={task} />
      </Link>
      <div style={style.rightColumn}>
        <StartTaskButton
          task={task}
          onStartTask={handleStartTask}
        />
        <div style={{ marginTop: '4px' }}>
          <RunningGoalDuration active={!!task.activeSession} task={task} />
        </div>
      </div>
    </div>
  );
}

const style = {
  root: {
    display: 'flex',
    margin: '0 16px',
    height: '80px',
    alignItems: 'center',
    lineHeight: '1.5em',
    fontSize: '14px',
  },
  leftColumn: {
    color: c.black,
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    textDecoration: 'none',
  },
  rightColumn: {
    textAlign: 'center',
    minWidth: '105px',
  },
  taskName: {
    fontSize: '16px',
  }
};


export default TaskListItem;
