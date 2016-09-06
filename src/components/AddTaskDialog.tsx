import * as React from 'react';
import { Dialog, FlatButton, TextField } from 'material-ui';

interface IAddTaskDialogProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (taskName: string) => void;
}

export default class AddTaskDialog extends React.Component<IAddTaskDialogProps, {}> {
  refs: {
    [name: string]: any;
    taskName: TextField;
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = this.refs.taskName.getValue();
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
          />
        </form>
      </Dialog>
    );
  }
}
