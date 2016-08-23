import * as c from './colors';

import { IRepeatSelectItemProps } from '../RepeatSelect';

const theme = {
  RepeatSelectItem: (props: IRepeatSelectItemProps) => ({
    border: `2px solid ${props.disabled ? c.whiteTransparent : c.cyan}`,
    backgroundColor: !props.disabled && props.isSelected ? c.cyan : c.transparent,
    color: !props.disabled && props.isSelected ? c.white : c.whiteTransparent,
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
