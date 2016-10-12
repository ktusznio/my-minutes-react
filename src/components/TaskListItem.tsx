import * as React from 'react';
import { browserHistory, Link } from 'react-router';

import * as c from './theme/colors';
import * as m from '../models';
import { IViewTask } from '../selectors';
import * as routes from '../utils/routes';
import { RunningTaskDuration, RunningGoalDuration } from './RunningDuration';
import StartTaskButton from './StartTaskButton';
import TaskHistoryDots from './TaskHistoryDots';

export interface ITaskListItemProps {
  task: IViewTask;
}

const handleStartTask = (task: m.ITask) =>
  browserHistory.push(routes.runningTask(task.id))

const TaskListItem = (props: ITaskListItemProps) => {
  const { task } = props;
  return (
    <div>
      <div style={style.root}>
        <Link style={style.leftColumn} to={routes.task(task.id)}>
          <div style={style.taskName}>{task.name}</div>
          <TaskHistoryDots active={!!task.activeSession} task={task} />
          <RunningTaskDuration active={!!task.activeSession} task={task} style={style.duration} />
        </Link>
        <div style={style.rightColumn}>
          <StartTaskButton
            task={task}
            onStartTask={handleStartTask}
          />
          <RunningGoalDuration active={!!task.activeSession} task={task} style={style.duration} />
        </div>
      </div>
      <hr style={style.hr} />
    </div>
  );
};

const style = {
  root: {
    display: 'flex',
    margin: '16px 0',
    height: '120px',
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
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-around',
    minWidth: '120px',
  },
  hr: {
    border: 'none',
    background: `-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(${c.grey}), to(${c.white}))`,
    color: c.white,
    display: 'block',
    height: '1px',
    margin: 0,
    width: '100%',
  },
  taskName: {
    fontSize: '18px',
  },
  duration: {
    fontSize: '12px',
  },
};

export default TaskListItem;
