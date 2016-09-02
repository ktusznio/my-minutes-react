import * as React from 'react';
import { RaisedButton } from 'material-ui';

interface IRaisedButtonProps {
  children?: any;
  disabledTouchRipple?: boolean;
  icon?: any;
  label?: string;
  onTouchTap?: () => void;
  primary?: boolean;
  style?: Object;
}

const getDefaultProps = (): IRaisedButtonProps => ({
  disabledTouchRipple: true,
  primary: true,
});

export default (props: IRaisedButtonProps) => {
  const _props = Object.assign(getDefaultProps(), props);
  return (
    <RaisedButton {..._props}>
      {props.children}
    </RaisedButton>
  );
}
