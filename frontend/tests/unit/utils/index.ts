/**
 * Test utilities index
 * Central export point for all testing utilities
 */

// Core test utilities
export * from './test-utils';
export * from './setup-mocks';
export * from './test-config';

// Re-export testing library utilities
export {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  getByRole,
  getByText,
  getByLabelText,
  getByTestId,
  queryByRole,
  queryByText,
  queryByLabelText,
  queryByTestId,
  findByRole,
  findByText,
  findByLabelText,
  findByTestId,
} from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';

// Common test patterns
export const commonTestSetup = () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
};

// Test environment helpers
export const skipIfCI = (testFn: () => void) => {
  if (process.env.CI === 'true') {
    test.skip('Skipped in CI environment', () => {});
  } else {
    testFn();
  }
};

export const runOnlyInCI = (testFn: () => void) => {
  if (process.env.CI === 'true') {
    testFn();
  } else {
    test.skip('Only runs in CI environment', () => {});
  }
};

// Debug helpers
export const debugElement = (element: HTMLElement) => {
  console.log('Element:', element);
  console.log('Classes:', element.className);
  console.log('Text content:', element.textContent);
  console.log('Inner HTML:', element.innerHTML);
  console.log('Attributes:', element.attributes);
};

export const debugScreen = () => {
  console.log('Current screen state:');
  screen.debug();
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  await waitFor(() => {}, { timeout: 100 });
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // Basic accessibility checks
  const buttons = container.querySelectorAll('button');
  const inputs = container.querySelectorAll('input, textarea, select');
  const images = container.querySelectorAll('img');

  // Check buttons have accessible names
  buttons.forEach((button, index) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasTitle = button.getAttribute('title');

    if (!hasText && !hasAriaLabel && !hasTitle) {
      console.warn(`Button ${index} missing accessible name`);
    }
  });

  // Check form elements have labels
  inputs.forEach((input, index) => {
    const hasLabel = container.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(`Input ${index} missing label`);
    }
  });

  // Check images have alt text
  images.forEach((img, index) => {
    const hasAlt = img.getAttribute('alt');
    if (!hasAlt) {
      console.warn(`Image ${index} missing alt text`);
    }
  });
};

// Custom testing utilities
export const createTestWrapper = (props: any = {}) => {
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="test-wrapper" {...props}>
      {children}
    </div>
  );
};

export const waitForLoadingToFinish = () => {
  return waitForElementToBeRemoved(() => screen.queryByTestId('loading-spinner'), {
    timeout: 10000,
  });
};

export const expectElementToBeLoading = (element: HTMLElement) => {
  expect(element).toHaveClass('animate-spin');
};

export const expectElementToHaveError = (element: HTMLElement) => {
  expect(element).toHaveClass('text-red-500');
};

export const expectElementToHaveSuccess = (element: HTMLElement) => {
  expect(element).toHaveClass('text-green-500');
};