import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders ProgTrack app', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const appElement = screen.getByText(/ProgTrack/i);
  expect(appElement).toBeInTheDocument();
});