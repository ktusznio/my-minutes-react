import * as React from 'react';
import { TextField } from 'material-ui';
import { padStart, replace } from 'lodash';

import * as format from '../utils/format';

const MAX_INPUT_LENGTH = 4;

export interface IDurationInputProps {
  defaultDuration?: number;
  hint?: string;
  disabled?: boolean;
}

interface IDurationInputState {
  hhmm: string;
  errorText: string;
}

export default class DurationInput extends React.Component<IDurationInputProps, IDurationInputState> {
  refs: {
    [name: string]: any;
    input: TextField;
  }

  static defaultProps = {
    hint: 'hh : mm',
    disabled: false,
  };

  constructor(props: IDurationInputProps) {
    super(props);

    this.state = {
      hhmm: this.getHhmmFromProps(props),
      errorText: '',
    };
  }

  componentWillReceiveProps(nextProps: IDurationInputProps) {
    this.setState(this.buildStateFromProps(nextProps));
  }

  buildStateFromProps = (props: IDurationInputProps) => ({
    hhmm: this.getHhmmFromProps(props),
    errorText: '',
  })

  getHhmmFromProps(props: IDurationInputProps) {
    const duration = props.defaultDuration;
    let hhmm = format.timeHiddenInput(duration);
    hhmm = padStart(hhmm, MAX_INPUT_LENGTH, '0');

    return hhmm;
  }

  getMilliseconds(): number {
    const input = this.state.hhmm;
    const hours = parseInt(input.substr(0, 2), 10);
    const minutes = parseInt(input.substr(2), 10);

    return 1000 * ((hours * 60 * 60) + (minutes * 60));
  }

  formatHhmm(): string {
    if (this.state.hhmm === '0000') {
      return '';
    }

    const hh = this.state.hhmm.substr(0, 2);
    const mm = this.state.hhmm.substr(2);

    return `${hh} : ${mm}`;
  }

  handleKeyDown = (e) => {
    e.preventDefault();

    let parsedInt;
    // e.key is 'Unidentified' in Safari.
    if (e.key === 'Unidentified') {
      // Ignore non-numeric keypresses.
      if (e.keyCode < 48 || e.keyCode > 57) {
        return;
      }
      parsedInt = e.keyCode - 48;
    } else {
      parsedInt = parseInt(e.key, 10);
    }

    let hhmm;
    switch (true) {
    // Numerics (0-9).
    case !isNaN(parsedInt):
      hhmm = this.state.hhmm + parsedInt;

      if (hhmm.length > MAX_INPUT_LENGTH) {
        hhmm = hhmm.substr(1);
      }
      break;

    // Backspace.
    case e.key === 'Backspace':
      hhmm = '0' + this.state.hhmm.substr(0, this.state.hhmm.length - 1);
      break;

    default:
      hhmm = this.state.hhmm;
    }

    let errorText = '';
    if (parseInt(hhmm, 10) > 2400) {
      errorText = 'Hey, one day at a time!';
    }

    this.setState({ hhmm, errorText });
  }

  render() {
    return (
      <TextField
        ref="input"
        type="tel"
        errorText={this.state.errorText}
        disabled={this.props.disabled}
        hintText={this.props.hint}
        fullWidth={true}
        value={this.formatHhmm()}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
