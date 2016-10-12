import * as React from 'react';
import { browserHistory } from 'react-router';

import * as m from '../models';
import TaskListItem from '../components/TaskListItem';
import { IViewTask } from '../selectors';
import { Column } from './Flex';

export interface ITaskListProps {
  tasks: IViewTask[];
}

const TaskList = (props: ITaskListProps) => {
  if (props.tasks.length === 0) {
    return <EmptyTaskList />;
  } else {
    return (
      <div>
        {props.tasks.map((task, i) =>
          <TaskListItem
            key={i}
            task={task}
          />
        )}
      </div>
    );
  }
}

const EmptyTaskList = () =>
  <Column style={style.emptyTaskList}>
    Add a task to get started. Tap + below.
  </Column>

const style = {
  emptyTaskList: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default TaskList;
