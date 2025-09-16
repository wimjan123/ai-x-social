import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<Button>Click me</Button>);

    const button = getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-x-blue');
  });

  it('renders different variants correctly', () => {
    const { getByRole, rerender } = render(
      <Button variant="outline">Outline</Button>
    );
    expect(getByRole('button')).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(getByRole('button')).toHaveClass('hover:bg-gray-100');

    rerender(<Button variant="destructive">Delete</Button>);
    expect(getByRole('button')).toHaveClass('bg-red-500');
  });

  it('renders different sizes correctly', () => {
    const { getByRole, rerender } = render(<Button size="sm">Small</Button>);
    expect(getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(getByRole('button')).toHaveClass('h-12');

    rerender(<Button size="md">Medium</Button>);
    expect(getByRole('button')).toHaveClass('h-10');
  });

  it('handles disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);

    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });

  it('shows loading state correctly', () => {
    const { getByText, getByRole } = render(<Button isLoading>Loading</Button>);
    expect(getByText('Loading...')).toBeInTheDocument();
    expect(getByRole('button')).toHaveClass('cursor-not-allowed');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click me</Button>
    );

    const button = getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { getByRole } = render(
      <Button className="custom-class">Custom</Button>
    );

    const button = getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('prevents click when disabled', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);

    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('pointer-events-none');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref test</Button>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});
