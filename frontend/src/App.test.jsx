import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './components/ui/Button'; // Assuming this component exists

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
