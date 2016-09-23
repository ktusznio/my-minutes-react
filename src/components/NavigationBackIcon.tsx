import * as React from 'react';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

const handleBack = (e: React.TouchEvent) => {
  e.preventDefault();
  browserHistory.goBack();
}

interface INavigationBackIconProps {
  onTouchTap?: (e: React.TouchEvent) => void;
}

const NavigationBackIcon = (props: INavigationBackIconProps) =>
  <IconButton onTouchTap={props.onTouchTap || handleBack}>
    <NavigationArrowBack color="#FFF" />
  </IconButton>

export default NavigationBackIcon;
