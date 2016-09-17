import { getMuiTheme } from 'material-ui/styles';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import { IRepeatSelectItemProps } from '../RepeatSelect';
import * as c from './colors';

const theme = {
  RepeatSelectItem: (props: IRepeatSelectItemProps) => ({
    border: `2px solid ${props.disabled ? c.whiteTransparent : c.cyan}`,
    backgroundColor: !props.disabled && props.isSelected ? c.cyan : c.transparent,
    color: !props.disabled && props.isSelected ? c.white : c.whiteTransparent,
    cursor: 'pointer',
    borderRadius: '100%',
    height: '36px',
    width: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  Link: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: c.black,
  }
};

export default theme;

export const muiTheme = getMuiTheme(Object.assign({}, lightBaseTheme, {

}));
