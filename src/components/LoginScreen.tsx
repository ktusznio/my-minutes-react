import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { signInWithFacebook } from '../actions/auth';
import * as actionTypes from '../actionTypes';
import { IAppState } from '../reducer';
import { IAuthState } from '../reducers/auth';
import { IRouteParams } from '../router';
import * as routes from '../utils/routes';
import FacebookIcon from './FacebookIcon';
import Navigation from './Navigation';
import RaisedButton from './RaisedButton';
import { Screen, ScreenContent } from './Screen';

interface ILoginScreenProps {
  auth: IAuthState;
  signInWithFacebook: () => void;
  params: IRouteParams;
  location: any;
}

const mapStateToProps = (state: IAppState) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  signInWithFacebook: () => dispatch(signInWithFacebook()),
})

class LoginScreen extends React.Component<ILoginScreenProps, {}> {
  componentWillReceiveProps(nextProps: ILoginScreenProps) {
    if (!this.props.auth.user && nextProps.auth.user) {
      const redirectTo = nextProps.location.query.redirect || routes.tasks();
      browserHistory.replace(redirectTo);
    }
  }

  render() {
    return (
      <Screen>
        <Navigation title="My Minutes" />
        <ScreenContent style={style.screenContent}>
          {this.renderBody()}
        </ScreenContent>
      </Screen>
    );
  }

  renderBody() {
    if (this.props.auth.status === actionTypes.ATTEMPT_LOGIN) {
      return <div>Logging in...</div>;
    } else {
      return (
        <RaisedButton
         label="Login with Facebook"
         icon={<FacebookIcon />}
         onTouchTap={this.props.signInWithFacebook}
         primary={true}
       />
     );
    }
  }

}

const style = {
  screenContent: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
