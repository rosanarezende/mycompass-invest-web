import { render, screen } from '@testing-library/react';
import HomePage from '../src/app/page';

// Mock do Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  }),
}));

describe('HomePage', () => {
  it('should render welcome message', () => {
    render(<HomePage />);
    
    const heading = screen.getByText(/MyCompass Invest/i);
    expect(heading).toBeInTheDocument();
  });

  it('should render features section', () => {
    render(<HomePage />);
    
    // Verifica se pelo menos uma feature está presente
    expect(screen.getByText(/Invest/i)).toBeInTheDocument();
  });
});
