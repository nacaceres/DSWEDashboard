import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// sguzmanm: Why keep these tests if you are not using them?
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
