import * as React from 'react';

const styles = {
  screen: {
    height: '100%',
  },
  screenContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: '80px 16px 0',
  },
};

export const Screen = (props) =>
  <div style={styles.screen}>
    {props.children}
  </div>

export const ScreenContent = (props) =>
  <div style={styles.screenContent}>
    {props.children}
  </div>
