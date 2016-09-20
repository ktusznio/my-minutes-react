import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { AppBar, IconMenu, MenuItem, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { IAppState } from '../reducer';
import { logout, ILogout } from '../actions/auth';
import * as routes from '../utils/routes';
import * as c from './theme/colors';

interface INavigationProps {
  title?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  logout?: ILogout;
  user?: firebase.User;
}

const mapStateToProps = (state: IAppState, props) => ({
  user: state.auth.user,
  title: props.title,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  logout: () => dispatch(logout()),
});

export const style = {
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    maxWidth: '768px',
    margin: '0 auto',
  },
  appBarLink: {
    color: c.white,
    textDecoration: 'none',
  },
};


class Navigation extends React.Component<INavigationProps, {}> {
  static defaultProps: INavigationProps = {
    title: 'My Minutes',
  };

  render() {
    const iconElementRight = this.props.rightIcon || this.renderRightMenu();
    return (
      <AppBar
        iconElementLeft={this.props.leftIcon}
        iconElementRight={iconElementRight}
        showMenuIconButton={!!this.props.leftIcon}
        style={style.appBar}
        title={this.props.title}
      />
    );
  }

  renderRightMenu() {
    const items = this.renderRightMenuItems();
    if (items.length === 0) {
      return null;
    }

    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'bottom'}}>
        {items}
      </IconMenu>
    );
  }

  renderRightMenuItems() {
    let menuItems = [];

    if (this.props.user) {
      menuItems.push(
        <MenuItem
          key={0}
          onTouchTap={() => this.props.logout()}
          primaryText="Log out" />
      );
    }

    return menuItems;
  }
}

export default connect<{}, {}, INavigationProps>(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
