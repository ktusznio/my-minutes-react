import * as React from 'react';
import { RaisedButton } from 'material-ui';

import { signInWithRedirect, facebookAuthProvider } from '../firebase/auth';
import FacebookIcon from './FacebookIcon';
import Navigation from './Navigation';
import { Screen, ScreenContent } from './Screen';

const handleFacebookLoginTap = () => {
  signInWithRedirect(facebookAuthProvider);
};

const LoginScreen = (props) =>
  <Screen>
    <Navigation title="Login" />
    <ScreenContent>
      <RaisedButton
       label="Login with Facebook"
       icon={<FacebookIcon />}
       onTouchTap={handleFacebookLoginTap}
       primary={true}
     />
    </ScreenContent>
  </Screen>

export default LoginScreen;
