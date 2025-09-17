import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { PoliticalAlignmentSelector } from '@/components/auth/PoliticalAlignmentSelector';
import type { PoliticalAlignment } from '@/types';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Flag: ({ size, className, ...props }: any) => (
    <div data-testid="flag-icon" className={className} style={{ width: size, height: size }} {...props} />
  ),
  Scale: ({ size, className, ...props }: any) => (
    <div data-testid="scale-icon" className={className} style={{ width: size, height: size }} {...props} />
  ),
  TrendingUp: ({ size, className, ...props }: any) => (
    <div data-testid="trending-up-icon" className={className} style={{ width: size, height: size }} {...props} />
  ),
  Users: ({ size, className, ...props }: any) => (
    <div data-testid="users-icon" className={className} style={{ width: size, height: size }} {...props} />
  ),
  Heart: ({ size, className, ...props }: any) => (
    <div data-testid="heart-icon" className={className} style={{ width: size, height: size }} {...props} />
  ),
}));

// Wrapper component for Chakra UI
const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

// Custom render function with Chakra provider
const renderWithChakra = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: ChakraWrapper, ...options });
};

describe('PoliticalAlignmentSelector', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default state', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      expect(screen.getByText('Political Alignment')).toBeInTheDocument();
      expect(screen.getByText('Choose your political position and customize your profile')).toBeInTheDocument();
      expect(screen.getByText('Political Position')).toBeInTheDocument();
      expect(screen.getByText('Political Intensity')).toBeInTheDocument();
      expect(screen.getByText('Key Issues')).toBeInTheDocument();
      expect(screen.getByText('Personal Statement (Optional)')).toBeInTheDocument();
    });

    it('renders all political position options', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      expect(screen.getByText('Conservative')).toBeInTheDocument();
      expect(screen.getByText('Liberal')).toBeInTheDocument();
      expect(screen.getByText('Progressive')).toBeInTheDocument();
      expect(screen.getByText('Libertarian')).toBeInTheDocument();
      expect(screen.getByText('Independent')).toBeInTheDocument();
    });

    it('renders intensity slider with default value', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      expect(screen.getByText('5/10')).toBeInTheDocument();
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });

    it('renders key issues grid', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const expectedIssues = [
        'Healthcare Reform',
        'Climate Change',
        'Economic Policy',
        'Immigration',
        'Education',
        'Gun Rights',
        'Criminal Justice',
        'Foreign Policy',
        'Tax Policy',
        'Social Security',
        'Infrastructure',
        'Technology Regulation',
      ];

      expectedIssues.forEach((issue) => {
        expect(screen.getByText(issue)).toBeInTheDocument();
      });
    });

    it('renders with custom className', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} className="custom-class" />
      );

      const container = screen.getByText('Political Alignment').closest('[class*="custom-class"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Pre-filled Values', () => {
    const prefilledValue: PoliticalAlignment = {
      position: 'progressive',
      intensity: 8,
      keyIssues: ['Climate Change', 'Healthcare Reform'],
      description: 'Strong progressive values',
    };

    it('displays pre-filled political position', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={prefilledValue} />
      );

      const progressiveButton = screen.getByText('Progressive').closest('button');
      expect(progressiveButton).toHaveClass('ring-2');
    });

    it('displays pre-filled intensity value', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={prefilledValue} />
      );

      expect(screen.getByText('8/10')).toBeInTheDocument();
    });

    it('displays pre-filled selected issues', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={prefilledValue} />
      );

      expect(screen.getByText('2 selected')).toBeInTheDocument();

      const climateButton = screen.getByText('Climate Change').closest('button');
      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');

      expect(climateButton).toHaveClass('variant-solid');
      expect(healthcareButton).toHaveClass('variant-solid');
    });

    it('displays pre-filled description', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={prefilledValue} />
      );

      const textarea = screen.getByDisplayValue('Strong progressive values');
      expect(textarea).toBeInTheDocument();
    });

    it('shows alignment preview with pre-filled values', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={prefilledValue} />
      );

      expect(screen.getByText('Alignment Preview')).toBeInTheDocument();
      expect(screen.getByText('Progressive')).toBeInTheDocument();
      expect(screen.getByText('Intensity: 8/10')).toBeInTheDocument();
      expect(screen.getByText('2 key issues')).toBeInTheDocument();
    });
  });

  describe('Position Selection', () => {
    it('selects conservative position', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      expect(mockOnChange).toHaveBeenCalledWith({
        position: 'conservative',
        intensity: 5,
        keyIssues: [],
        description: '',
      });
    });

    it('selects liberal position', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const liberalButton = screen.getByText('Liberal').closest('button');
      await user.click(liberalButton!);

      expect(mockOnChange).toHaveBeenCalledWith({
        position: 'liberal',
        intensity: 5,
        keyIssues: [],
        description: '',
      });
    });

    it('selects progressive position', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const progressiveButton = screen.getByText('Progressive').closest('button');
      await user.click(progressiveButton!);

      expect(mockOnChange).toHaveBeenCalledWith({
        position: 'progressive',
        intensity: 5,
        keyIssues: [],
        description: '',
      });
    });

    it('selects libertarian position', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const libertarianButton = screen.getByText('Libertarian').closest('button');
      await user.click(libertarianButton!);

      expect(mockOnChange).toHaveBeenCalledWith({
        position: 'libertarian',
        intensity: 5,
        keyIssues: [],
        description: '',
      });
    });

    it('shows tooltips for position options', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.hover(conservativeButton!);

      await waitFor(() => {
        expect(screen.getByText('Traditional values, limited government, free markets')).toBeInTheDocument();
      });
    });

    it('updates button styling when position is selected', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      expect(conservativeButton).toHaveClass('variant-solid');
    });
  });

  describe('Intensity Slider', () => {
    it('changes intensity value', async () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // First select a position
      const conservativeButton = screen.getByText('Conservative').closest('button');
      await userEvent.click(conservativeButton!);

      // Then change intensity - simulate slider interaction
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '7' } });

      expect(mockOnChange).toHaveBeenLastCalledWith({
        position: 'conservative',
        intensity: 7,
        keyIssues: [],
        description: '',
      });
    });

    it('displays updated intensity badge', async () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '9' } });

      expect(screen.getByText('9/10')).toBeInTheDocument();
    });

    it('updates slider track color based on selected position', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const progressiveButton = screen.getByText('Progressive').closest('button');
      await user.click(progressiveButton!);

      const sliderTrack = screen.getByRole('slider').parentElement?.querySelector('[class*="SliderFilledTrack"]');
      expect(sliderTrack).toHaveStyle('background: political-progressive-500');
    });
  });

  describe('Key Issues Selection', () => {
    it('selects and deselects individual issues', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // First select a position
      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      // Select an issue
      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');
      await user.click(healthcareButton!);

      expect(mockOnChange).toHaveBeenLastCalledWith({
        position: 'conservative',
        intensity: 5,
        keyIssues: ['Healthcare Reform'],
        description: '',
      });

      // Deselect the same issue
      await user.click(healthcareButton!);

      expect(mockOnChange).toHaveBeenLastCalledWith({
        position: 'conservative',
        intensity: 5,
        keyIssues: [],
        description: '',
      });
    });

    it('selects multiple issues', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // First select a position
      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      // Select multiple issues
      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');
      const climateButton = screen.getByText('Climate Change').closest('button');
      const economyButton = screen.getByText('Economic Policy').closest('button');

      await user.click(healthcareButton!);
      await user.click(climateButton!);
      await user.click(economyButton!);

      expect(mockOnChange).toHaveBeenLastCalledWith({
        position: 'conservative',
        intensity: 5,
        keyIssues: ['Healthcare Reform', 'Climate Change', 'Economic Policy'],
        description: '',
      });
    });

    it('updates issue counter', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');
      await user.click(healthcareButton!);

      expect(screen.getByText('1 selected')).toBeInTheDocument();
    });

    it('updates issue button styling when selected', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');
      await user.click(healthcareButton!);

      expect(healthcareButton).toHaveClass('variant-solid');
    });
  });

  describe('Description Input', () => {
    it('updates description text', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // First select a position
      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      const textarea = screen.getByPlaceholderText('Describe your political views in your own words...');
      await user.type(textarea, 'My political views');

      expect(mockOnChange).toHaveBeenLastCalledWith({
        position: 'conservative',
        intensity: 5,
        keyIssues: [],
        description: 'My political views',
      });
    });

    it('shows character count', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Describe your political views in your own words...');
      await user.type(textarea, 'Test description');

      expect(screen.getByText('16/500 characters')).toBeInTheDocument();
    });

    it('limits description to 500 characters', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Describe your political views in your own words...');
      expect(textarea).toHaveAttribute('maxLength'); // Would be enforced by browser
    });
  });

  describe('Alignment Preview', () => {
    it('shows preview when position is selected', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      expect(screen.getByText('Alignment Preview')).toBeInTheDocument();
      expect(screen.getByText('Conservative')).toBeInTheDocument();
      expect(screen.getByText('Intensity: 5/10')).toBeInTheDocument();
    });

    it('shows preview when issues are selected without changing position', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');
      await user.click(healthcareButton!);

      expect(screen.getByText('Alignment Preview')).toBeInTheDocument();
      expect(screen.getByText('1 key issues')).toBeInTheDocument();
    });

    it('hides preview when independent with no issues', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // Default state should not show preview
      expect(screen.queryByText('Alignment Preview')).not.toBeInTheDocument();
    });

    it('updates preview dynamically', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // Select position
      const progressiveButton = screen.getByText('Progressive').closest('button');
      await user.click(progressiveButton!);

      expect(screen.getByText('Progressive')).toBeInTheDocument();

      // Change intensity
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '8' } });

      expect(screen.getByText('Intensity: 8/10')).toBeInTheDocument();

      // Add issues
      const climateButton = screen.getByText('Climate Change').closest('button');
      await user.click(climateButton!);

      expect(screen.getByText('1 key issues')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('calls onChange for every state change', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      mockOnChange.mockClear();

      // Each interaction should trigger onChange
      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      expect(mockOnChange).toHaveBeenCalledTimes(1);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '7' } });

      expect(mockOnChange).toHaveBeenCalledTimes(2);

      const healthcareButton = screen.getByText('Healthcare Reform').closest('button');
      await user.click(healthcareButton!);

      expect(mockOnChange).toHaveBeenCalledTimes(3);

      const textarea = screen.getByPlaceholderText('Describe your political views in your own words...');
      await user.type(textarea, 'Test');

      expect(mockOnChange).toHaveBeenCalledTimes(7); // 4 characters typed
    });

    it('provides complete alignment object on each change', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      const expectedAlignment: PoliticalAlignment = {
        position: 'conservative',
        intensity: 5,
        keyIssues: [],
        description: '',
      };

      expect(mockOnChange).toHaveBeenCalledWith(expectedAlignment);
    });
  });

  describe('Visual Feedback and Animations', () => {
    it('applies position-specific colors', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      // Check if the button has position-specific styling
      expect(conservativeButton).toHaveStyle('border-color: political.conservative.500');
    });

    it('shows hover effects on position buttons', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.hover(conservativeButton!);

      expect(conservativeButton).toHaveClass('_hover:borderColor');
    });

    it('applies fade-in animation to preview', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      const preview = screen.getByText('Alignment Preview').closest('div');
      expect(preview).toHaveClass('animate-fade-in');
    });
  });

  describe('Responsive Design', () => {
    it('adapts grid layout for position buttons', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const grid = screen.getByText('Conservative').closest('[class*="grid"]');
      expect(grid).toHaveClass('columns-1', 'md:columns-2', 'lg:columns-3');
    });

    it('adapts grid layout for issues', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const issueGrid = screen.getByText('Healthcare Reform').closest('[class*="grid"]');
      expect(issueGrid).toHaveClass('columns-2', 'md:columns-3', 'lg:columns-4');
    });
  });

  describe('Accessibility', () => {
    it('provides proper form labels', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      expect(screen.getByLabelText('Political Position')).toBeInTheDocument();
      expect(screen.getByLabelText(/Political Intensity/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Key Issues/)).toBeInTheDocument();
      expect(screen.getByLabelText('Personal Statement (Optional)')).toBeInTheDocument();
    });

    it('provides proper button roles and labels', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      expect(conservativeButton).toHaveAttribute('role', 'button');
    });

    it('provides proper slider accessibility', () => {
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '1');
      expect(slider).toHaveAttribute('aria-valuemax', '10');
      expect(slider).toHaveAttribute('aria-valuenow', '5');
    });

    it('provides tooltips for better understanding', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.hover(conservativeButton!);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty initial value gracefully', () => {
      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={{} as PoliticalAlignment} />
      );

      expect(screen.getByText('5/10')).toBeInTheDocument();
      expect(screen.getByText('0 selected')).toBeInTheDocument();
    });

    it('handles partial initial value', () => {
      const partialValue = {
        position: 'liberal' as const,
        intensity: 6,
      } as PoliticalAlignment;

      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={partialValue} />
      );

      expect(screen.getByText('6/10')).toBeInTheDocument();
      const liberalButton = screen.getByText('Liberal').closest('button');
      expect(liberalButton).toHaveClass('variant-solid');
    });

    it('handles extreme intensity values', () => {
      const extremeValue: PoliticalAlignment = {
        position: 'conservative',
        intensity: 1,
        keyIssues: [],
        description: '',
      };

      renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={extremeValue} />
      );

      expect(screen.getByText('1/10')).toBeInTheDocument();
    });

    it('handles maximum issues selection', async () => {
      const user = userEvent.setup();
      renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      // Select all available issues
      const issueButtons = [
        'Healthcare Reform',
        'Climate Change',
        'Economic Policy',
        'Immigration',
        'Education',
        'Gun Rights',
        'Criminal Justice',
        'Foreign Policy',
        'Tax Policy',
        'Social Security',
        'Infrastructure',
        'Technology Regulation',
      ];

      for (const issue of issueButtons) {
        const button = screen.getByText(issue).closest('button');
        await user.click(button!);
      }

      expect(screen.getByText('12 selected')).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for default state', () => {
      const { container } = renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with pre-filled values', () => {
      const prefilledValue: PoliticalAlignment = {
        position: 'progressive',
        intensity: 8,
        keyIssues: ['Climate Change', 'Healthcare Reform'],
        description: 'Strong progressive values',
      };

      const { container } = renderWithChakra(
        <PoliticalAlignmentSelector {...defaultProps} value={prefilledValue} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with alignment preview visible', async () => {
      const user = userEvent.setup();
      const { container } = renderWithChakra(<PoliticalAlignmentSelector {...defaultProps} />);

      const conservativeButton = screen.getByText('Conservative').closest('button');
      await user.click(conservativeButton!);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});