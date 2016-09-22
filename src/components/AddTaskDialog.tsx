import * as React from 'react';
import { Dialog, FlatButton, TextField } from 'material-ui';

interface IAddTaskDialogProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (taskName: string) => void;
}

interface IAddTaskDialogState {
  errorText: string;
}

const ERROR_BLANK_NAME = 'A task name is required.';

export default class AddTaskDialog extends React.Component<IAddTaskDialogProps, IAddTaskDialogState> {
  refs: {
    [name: string]: any;
    taskName: TextField;
  }

  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    };
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = this.refs.taskName.getValue();
    if (!name) {
      this.setState({ errorText: ERROR_BLANK_NAME });
      return;
    }
    this.props.onSubmit(name);
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.props.onRequestClose}
      />,
      <FlatButton
        label="Add Task"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Add a task"
        actions={actions}
        open={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            ref="taskName"
            hintText="Task name"
            errorText={this.state.errorText}
            style={style.textField}
          />
        </form>
      </Dialog>
    );
  }
}

const style = {
  textField: {
    maxWidth: '100%',
  },
};
