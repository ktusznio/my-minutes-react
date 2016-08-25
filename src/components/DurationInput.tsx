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
    hint: 'hh:mm',
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
    let hhmm = format.duration(duration, format.DURATION_HHMM);
    hhmm = padStart(hhmm, MAX_INPUT_LENGTH, '0');

    return hhmm;
  }

  getMilliseconds(): number {
    const input = this.state.hhmm;
    const hours = parseInt(input.substr(0, 2), 10);
    const minutes = parseInt(input.substr(2), 10);

    return 1000 * ((hours * 60 * 60) + (minutes * 60));
  }

  handleKeyDown = (e) => {
    e.preventDefault();

    let hhmm;
    switch (true) {
    // Backspace.
    case e.keyCode === 8:
      hhmm = '0' + this.state.hhmm.substr(0, this.state.hhmm.length - 1);
      break;

    // Numerics (0-9).
    case e.keyCode >= 48 && e.keyCode <= 57:
      const char = String.fromCharCode(e.keyCode);
      hhmm = this.state.hhmm + char;

      if (hhmm.length > MAX_INPUT_LENGTH) {
        hhmm = hhmm.substr(1);
      }
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
        errorText={this.state.errorText}
        disabled={this.props.disabled}
        hintText={this.props.hint}
        fullWidth={true}
        value={format.duration(this.getMilliseconds(), format.DURATION_H_M)}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
