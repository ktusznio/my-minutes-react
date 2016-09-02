import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { signInWithFacebook } from '../actions/auth';
import auth, { signInWithRedirect, facebookAuthProvider } from '../firebase/auth';
import { IAppState } from '../reducer';
import { IAuthState } from '../reducers/auth';
import * as routes from '../utils/routes';
import FacebookIcon from './FacebookIcon';
import Navigation from './Navigation';
import RaisedButton from './RaisedButton';
import { Screen, ScreenContent } from './Screen';

interface ILoginScreenProps {
  auth: IAuthState;
  signInWithFacebook: () => void;
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
      browserHistory.replace(routes.tasks());
    }
  }

  render() {
    return (
      <Screen>
        <Navigation title="My Minutes" />
        <ScreenContent>
          <RaisedButton
           label="Login with Facebook"
           icon={<FacebookIcon />}
           onTouchTap={this.props.signInWithFacebook}
           primary={true}
         />
        </ScreenContent>
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
