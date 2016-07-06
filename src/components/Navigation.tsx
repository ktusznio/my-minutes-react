import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { AppBar, IconMenu, MenuItem, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { IAppState } from '../reducer';
import { logout, ILogout } from '../actions/auth';
import * as routes from '../utils/routes';

interface INavigationProps {
  title: string;
  leftIcon?: JSX.Element;
}

interface IConnectedNavigationProps extends INavigationProps {
  logout: ILogout;
  user: firebase.User;
}

const mapStateToProps = (state: IAppState, props) => ({
  user: state.auth.user,
  title: props.title,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  logout: () => dispatch(logout()),
});

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '64px',
};

class Navigation extends React.Component<IConnectedNavigationProps, {}> {
  static defaultProps: IConnectedNavigationProps = {
    title: "My Minutes",
    logout: null,
    user: null,
    leftIcon: null,
  };

  render() {
    return (
      <AppBar
        iconElementRight={this.renderRightMenu()}
        iconElementLeft={this.props.leftIcon}
        showMenuIconButton={!!this.props.leftIcon}
        title={this.props.title}
        style={style}
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
          onTouchTap={this.props.logout}
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
