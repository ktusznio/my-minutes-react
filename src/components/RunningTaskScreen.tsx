import * as React from 'react';
import { connect } from 'react-redux';

import { startTask, stopTask } from '../actions/tasks';
import * as m from '../models';
import { IAppState } from '../reducer';
import { RouteParams } from '../router';
import { taskSelector, IViewTask } from '../selectors';
import { Column } from './Flex';
import Navigation from './Navigation';
import NavigationBackIcon from './NavigationBackIcon';
import RunningDuration from './RunningDuration';
import { Screen, ScreenContent } from './Screen';
import StartTaskButton from './StartTaskButton';
import TaskHistoryDots from './TaskHistoryDots';

export interface IRunningTaskScreenProps {
  task: IViewTask;
  startTask: ((task: IViewTask) => void);
  stopTask: ((task: IViewTask) => void);
  params: RouteParams;
}

const mapStateToProps = (state: IAppState, props: IRunningTaskScreenProps) => ({
  task: taskSelector(state, props.params.taskId),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  startTask: (task: IViewTask) => dispatch(startTask(task)),
  stopTask: (task: IViewTask) => dispatch(stopTask(task)),
});

const style = {
  task: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '40px auto 0',
  },
  goal: {
    fontSize: '16px',
    margin: '10px auto 0',
  },
};

const RunningTaskScreen = (props: IRunningTaskScreenProps) => {
  const { task } = props;
  return (
    <Screen>
      <Navigation
        leftIcon={<NavigationBackIcon />}
        title={task.name}
      />
      <ScreenContent style={{ height: '100%' }}>
        <Column style={{ flex: 1 }}>
          <RunningDuration style={style.task} task={task} />
          <RunningDuration style={style.goal} task={task} renderGoal={true} />
        </Column>
        <div style={{ flex: 1, margin: '40px auto 0' }}>
          <StartTaskButton task={task} />
          <TaskHistoryDots task={task} />
        </div>
      </ScreenContent>
    </Screen>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunningTaskScreen);
