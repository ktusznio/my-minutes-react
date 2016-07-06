import * as React from 'react';
import { browserHistory } from 'react-router';

import * as m from '../models';
import TaskListItem from '../components/TaskListItem';
import { IViewTask } from '../selectors';

export interface ITaskListProps {
  tasks: IViewTask[];
}

const TaskList = (props: ITaskListProps) =>
  <div>
    {props.tasks.map((task, i) =>
      <TaskListItem
        key={i}
        task={task}
      />
    )}
  </div>

export default TaskList;
