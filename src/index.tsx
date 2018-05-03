import * as React from 'react';
import { render } from 'react-dom';
import Examples from './examples/Examples';

render(<Examples />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, { exclude: [/^RLDDFloating/] });
}