import * as React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import AvPauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';

import { startTask, stopTask } from '../actions/tasks';
import * as m from '../models';
import { IViewTask } from '../selectors';
import * as routes from '../utils/routes';
import * as c from './theme/colors';
import RaisedButton from './RaisedButton';

interface IStartTaskButtonProps {
  onStartTask?: (task: IViewTask) => void;
  onStopTask?: (task: IViewTask) => void;
  task: IViewTask;
  style?: Object;
}

interface IConnectedStartTaskButtonProps extends IStartTaskButtonProps {
  startTask: (task: IViewTask) => void;
  stopTask: (task: IViewTask) => void;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  startTask: (task: IViewTask) => dispatch(startTask(task)),
  stopTask: (task: IViewTask) => dispatch(stopTask(task)),
});

const handleStartTask = (props) => {
  props.startTask(props.task);
  if (props.onStartTask) {
    props.onStartTask(props.task);
  }
};

const handleStopTask = (props) => {
  props.stopTask(props.task);
  if (props.onStopTask) {
    props.onStopTask(props.task);
  }
};

const StartTaskButton = (props: IStartTaskButtonProps) => {
  const { task } = props;
  const activeSession = task.activeSession;
  const buttonStyle = Object.assign({}, style.button, props.style);

  if (activeSession) {
    return (
      <RaisedButton
        onTouchTap={() => handleStopTask(props)}
        style={buttonStyle}>
        <div style={{color: c.white}}>
          <AvPauseCircleOutline style={style.playPauseIcon} />
          <span style={style.text}>Pause</span>
        </div>
      </RaisedButton>
    );
  } else {
    return (
      <RaisedButton
        onTouchTap={() => handleStartTask(props)}
        style={buttonStyle}>
        <div style={{color: c.white}}>
          <AvPlayCircleOutline style={style.playPauseIcon} />
          <span style={style.text}>Start</span>
        </div>
      </RaisedButton>
    );
  }
};

const style = {
  button: {
    minWidth: '105px',
  },
  playPauseIcon: {
    display: 'inline-block',
    fill: c.white,
    height: '24px',
    width: '24px',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    verticalAlign: 'middle',
    marginLeft: '12px',
    marginRight: 0,
  },
  text: {
    fontSize: '14px',
    letterSpacing: 0,
    fontWeight: 500,
    margin: 0,
    paddingLeft: '8px',
    paddingRight: '16px',
  }
};

export default connect<{}, {}, IStartTaskButtonProps>(
  state => state,
  mapDispatchToProps
)(StartTaskButton);
