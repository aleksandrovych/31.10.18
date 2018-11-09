import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App className="bg-secondary bg-gradient-light h-100"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
