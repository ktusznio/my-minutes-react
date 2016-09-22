import * as React from 'react';

import { IGoal, GOAL_REPEATS_DEFAULT } from '../models';
import { Row } from './Flex';
import * as c from './theme/colors';

export interface IRepeatSelectItemProps {
  onTouchTap: (e: React.TouchEvent) => void,
  disabled?: boolean;
  isSelected: boolean;
  text: string;
}

const RepeatSelectItem = (props: IRepeatSelectItemProps) =>
  <div
    onTouchTap={(e) => { e.preventDefault(); props.onTouchTap(e); }}
    style={style.repeatSelectItem(props)}>
    {props.text}
  </div>

const WEEKDAYS = "SMTWTFS".split('');

interface IGoalRepeatSelectProps {
  repeats: Array<boolean>;
  disabled?: boolean;
}

class RepeatSelect extends React.Component<IGoalRepeatSelectProps, IGoalRepeatSelectProps> {
  constructor(props: IGoalRepeatSelectProps) {
    super(props);
    this.state = this.buildStateFromProps(props);
  }

  componentWillReceiveProps(nextProps: IGoalRepeatSelectProps) {
    this.setState(this.buildStateFromProps(nextProps));
  }

  buildStateFromProps = (props: IGoalRepeatSelectProps) => ({
    repeats: props.repeats,
  })

  handleItemTouchTap = (index) => {
    if (this.props.disabled) {
      return;
    }

    const repeats = this.state.repeats.slice();
    repeats[index] = !repeats[index];

    this.setState({ repeats });
  }

  getRepeats(): Array<boolean> {
    return this.props.disabled ? GOAL_REPEATS_DEFAULT : this.state.repeats;
  }

  render() {
    return (
      <Row style={{ justifyContent: 'space-between' }}>
        {this.renderItems()}
      </Row>
    );
  }

  renderItems() {
    return WEEKDAYS.map((day, index) =>
      <RepeatSelectItem
        key={index}
        disabled={this.props.disabled}
        text={day}
        isSelected={this.state.repeats[index]}
        onTouchTap={() => this.handleItemTouchTap(index)}
      />
    );
  }
}

const style = {
  repeatSelectItem: (props: IRepeatSelectItemProps) => ({
    alignItems: 'center',
    backgroundColor: !props.disabled && props.isSelected ? c.cyan : c.transparent,
    border: `2px solid ${props.disabled ? c.whiteTransparent : c.cyan}`,
    borderRadius: '100%',
    color: !props.disabled && props.isSelected ? c.white : c.whiteTransparent,
    cursor: 'pointer',
    display: 'flex',
    height: '36px',
    justifyContent: 'center',
    width: '36px',
  }),
};

export default RepeatSelect;
