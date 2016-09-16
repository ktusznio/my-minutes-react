import * as React from 'react';

import { style as navigationStyle } from './Navigation';

const styles = {
  screen: {
    height: '100%',
    position: 'relative',
  },
  screenContent: {
    display: 'flex',
    flexDirection: 'column',
    height: `calc(100vh - ${navigationStyle.appBar.height})`,
    margin: `${navigationStyle.appBar.height} 16px 0`,
  },
};

export const Screen = (props) =>
  <div style={styles.screen}>
    {props.children}
  </div>

export const ScreenContent = (props) =>
  <div style={Object.assign({}, styles.screenContent, props.style)}>
    {props.children}
  </div>
