import * as React from 'react';

export const Row = (props) =>
  <div style={ Object.assign({ display: 'flex', flexDirection: 'row' }, props.style) }>
    {props.children}
  </div>

export const Column = (props) =>
  <div style={ Object.assign({ display: 'flex', flexDirection: 'column' }, props.style) }>
    {props.children}
  </div>
