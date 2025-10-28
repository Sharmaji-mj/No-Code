// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });



import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Project Builder header', () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Project Builder/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders main app component', () => {
  render(<App />);
  const appElement = screen.getByRole('main');
  expect(appElement).toBeInTheDocument();
});