import * as React from 'react';
import FileCloudQueue from 'material-ui/svg-icons/file/cloud-queue';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';

import { Column } from './Flex';
import Navigation from './Navigation';
import { Screen, ScreenContent } from './Screen';

interface INoConnectionScreenState {
  timeoutId: any;
}

export default class NoConnectionScreen extends React.Component<{}, INoConnectionScreenState> {
  constructor(props) {
    super(props);
    this.state = {
      timeoutId: setTimeout(() => this.setState({ timeoutId: null }), 2500),
    };
  }

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutId);
  }

  render() {
    return (
      <Screen>
        <Navigation title="My Minutes" />
        <ScreenContent>
          {this.renderBody()}
        </ScreenContent>
      </Screen>
    );
  }

  renderBody() {
    if (this.state.timeoutId) {
      return (
        <Column style={style.body}>
          <FileCloudQueue style={style.cloudIcon} />
          <h3>Connecting...</h3>
        </Column>
      );
    } else {}
    return (
      <Column style={style.body}>
        <FileCloudOff style={style.cloudIcon} />
        <h3>No Connection</h3>
        <p>My Minutes needs an internet connection to start.</p>
      </Column>
    )
  }
}

const style = {
  body: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  cloudIcon: {
    height: 56,
    width: 56,
  }
}
