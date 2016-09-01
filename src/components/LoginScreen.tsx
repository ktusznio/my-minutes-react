import { RaisedButton } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import auth, { signInWithRedirect, facebookAuthProvider } from '../firebase/auth';
import { IAppState } from '../reducer';
import { IAuthState } from '../reducers/auth';
import FacebookIcon from './FacebookIcon';
import Navigation from './Navigation';
import { Screen, ScreenContent } from './Screen';

interface ILoginScreenProps {
  auth: IAuthState;
}

interface IRouterContext {
  router: any;
}

const mapStateToProps = (state: IAppState): ILoginScreenProps => ({
  auth: state.auth,
})

class LoginScreen extends React.Component<ILoginScreenProps, {}> {
  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  };

  context: IRouterContext;

  handleFacebookLoginTap = () => {
    signInWithRedirect(facebookAuthProvider);
  };

  componentWillMount() {
    // Check for a successful login through the redirect flow and navigate to
    // the tasks screen.
    // For the logout flow, avoid the redirect by checking for a logged-in user.
    if (!this.props.auth.user) {
      auth.getRedirectResult().then(result => {
        if (result.user) {
          browserHistory.replace('/');
        }
      });
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
           onTouchTap={this.handleFacebookLoginTap}
           primary={true}
         />
        </ScreenContent>
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps
)(LoginScreen);
