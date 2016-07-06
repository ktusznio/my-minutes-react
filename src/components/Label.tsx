import * as React from 'react';

interface ILabelProps {
  for?: string;
  text?: string;
  style?: Object;
}

const style = {
  fontSize: '14px',
  color: 'rgba(0, 0, 0, 0.5)',
}

const Label = (props: ILabelProps) =>
  <label style={Object.assign({}, style, props.style)}>
    {props.text}
  </label>

export default Label;
