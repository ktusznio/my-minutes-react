import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import ActionPermIdentity from 'material-ui/svg-icons/action/perm-identity';

import * as authActions from '../actions/auth';
import * as actionTypes from '../actionTypes';
import { ProviderId } from '../firebase/firebaseClient';
import { IAppState } from '../reducer';
import { IAuthState } from '../reducers/auth';
import { IRouteParams } from '../router';
import * as routes from '../utils/routes';
import { Column } from './Flex';
import * as SvgIcons from './SvgIcons';
import Navigation, { style as navigationStyle } from './Navigation';
import RaisedButton from './RaisedButton';
import { Screen, ScreenContent } from './Screen';
import * as c from './theme/colors';

const providerNames = {
  'facebook.com': 'Facebook',
  'google.com': 'Google',
  'twitter.com': 'Twitter',
};

interface ILoginScreenProps {
  auth: IAuthState;
  signInWithProvider: (provider: ProviderId) => void;
  cancelLogin: () => void;
  params: IRouteParams;
  location: any;
}

const mapStateToProps = (state: IAppState) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  signInWithProvider: (providerId: ProviderId) => {
    dispatch(authActions.signInWithProvider(providerId));
  },
  cancelLogin: () => {
    dispatch(authActions.cancelLogin());
  },
});

class LoginScreen extends React.Component<ILoginScreenProps, {}> {
  componentWillReceiveProps(nextProps: ILoginScreenProps) {
    if (!this.props.auth.user && nextProps.auth.user) {
      const redirectTo = nextProps.location.query.redirect || routes.tasks();
      browserHistory.replace(redirectTo);
    }
  }

  handleLoginTap = (providerId: ProviderId) => {
    this.props.signInWithProvider(providerId);
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
      return this.renderLoggingIn();
    } else if (this.props.auth.status === actionTypes.ACCOUNT_EXISTS) {
      return this.renderAccountExists();
    } else {
      return (
        <Column>
          <h3 style={style.heading}>Hey there!</h3>
          <p style={style.paragraph}>Log in to start setting goals for your time!</p>
          <RaisedButton
           label="Log in with Facebook"
           icon={<SvgIcons.Facebook />}
           onTouchTap={() => this.handleLoginTap('facebook.com')}
           primary={true}
           style={style.button}
         />
          <RaisedButton
           label="Log in with Google"
           icon={<SvgIcons.Google />}
           onTouchTap={() => this.handleLoginTap('google.com')}
           primary={true}
           style={style.button}
         />
          <RaisedButton
           label="Log in with Twitter"
           icon={<SvgIcons.Twitter />}
           onTouchTap={() => this.handleLoginTap('twitter.com')}
           primary={true}
           style={style.button}
         />
        </Column>
     );
    }
  }

  renderLoggingIn() {
    return (
      <Column style={style.loggingInContainer}>
        <ActionPermIdentity style={style.loggingInIcon} />
        <h3>Logging in...</h3>
      </Column>
    );
  }

  renderAccountExists() {
    const { requestedProviderId, existingProviderId } = this.props.auth;
    const requestedProvider = providerNames[requestedProviderId];
    const existingProvider = providerNames[existingProviderId];

    return (
      <Column>
        <h3 style={style.heading}>You already have an account</h3>
        <p style={style.paragraph}>
          You already used {existingProvider} to log in.
          Log in with {existingProvider} and link your {requestedProvider} account?
        </p>
        <RaisedButton
         label={`Log in with ${existingProvider}`}
         icon={SvgIcons.renderAuthProviderIcon(existingProviderId)}
         onTouchTap={() => this.handleLoginTap(existingProviderId)}
         primary={true}
         style={style.button}
       />
        <RaisedButton
         label="Cancel"
         onTouchTap={this.props.cancelLogin}
         style={style.button}
       />
      </Column>
   );
  }
}

const style = {
  screenContent: {
    alignItems: 'center',
    display: 'flex',
    height: `calc(100vh - ${navigationStyle.appBar.height} - 32px)`,
    justifyContent: 'center',
    paddingTop: '32px',
  },
  heading: {
    margin: '0 0 16px',
  },
  paragraph: {
    margin: '0 0 48px',
  },
  button: {
    marginBottom: '20px',
  },
  loggingInContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  loggingInIcon: {
    height: 56,
    width: 56,
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
