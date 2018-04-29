import * as React from 'react';
import { render } from 'react-dom';
import Example from './examples/Example';

render(<Example />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}