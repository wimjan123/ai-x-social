# Authentication Components

A comprehensive authentication component suite for the AI Social Media Platform with political persona features.

## Components

### LoginForm
Handles user authentication with email/username and password.

**Features:**
- Form validation with Zod schema
- Password visibility toggle
- Remember me functionality
- Error handling and loading states
- Responsive design with X-like styling

**Usage:**
```tsx
import { LoginForm } from '@/components/auth';

<LoginForm
  onSuccess={(user) => console.log('Logged in:', user)}
  onError={(error) => console.error('Login failed:', error)}
  redirectTo="/dashboard"
/>
```

### RegisterForm
Multi-step registration process with political alignment and persona type selection.

**Features:**
- 4-step registration wizard
- Form validation with Zod
- Political alignment configuration
- Persona type selection
- Progress indicator
- Step-by-step validation

**Usage:**
```tsx
import { RegisterForm } from '@/components/auth';

<RegisterForm
  onSuccess={(user) => console.log('Account created:', user)}
  onError={(error) => console.error('Registration failed:', error)}
/>
```

### LogoutButton
Configurable logout button with confirmation dialog.

**Features:**
- Multiple variants (button, menu-item, icon)
- Optional confirmation dialog
- API cleanup on logout
- Customizable styling

**Usage:**
```tsx
import { LogoutButton } from '@/components/auth';

<LogoutButton
  variant="button"
  showConfirmation={true}
  onLogout={() => console.log('User logged out')}
/>
```

### AuthGuard
Route protection component and authentication state management.

**Features:**
- Route-level authentication protection
- Loading states
- Automatic redirects
- HOC pattern support
- Authentication state hook

**Usage:**
```tsx
import { AuthGuard, withAuthGuard, useAuthGuard } from '@/components/auth';

// Component wrapper
<AuthGuard requireAuth={true} redirectTo="/login">
  <ProtectedContent />
</AuthGuard>

// HOC pattern
const ProtectedComponent = withAuthGuard(MyComponent);

// Hook for auth state
const { isAuthenticated, user, isLoading } = useAuthGuard();
```

### PoliticalAlignmentSelector
Interactive political alignment configuration component.

**Features:**
- 5 political positions (Conservative, Liberal, Progressive, Libertarian, Independent)
- Intensity slider (1-10 scale)
- Issue selection from 12 common topics
- Personal statement text area
- Real-time preview
- Accessible design

**Usage:**
```tsx
import { PoliticalAlignmentSelector } from '@/components/auth';

<PoliticalAlignmentSelector
  value={currentAlignment}
  onChange={(alignment) => setAlignment(alignment)}
/>
```

### PersonaTypeSelector
Account type selection with influence levels and features.

**Features:**
- 9 persona types (Politician, Influencer, Journalist, etc.)
- Influence level indicators
- Feature descriptions
- Customization text area
- Type-specific previews

**Usage:**
```tsx
import { PersonaTypeSelector } from '@/components/auth';

<PersonaTypeSelector
  value={currentType}
  onChange={(type, customization) => handleTypeChange(type, customization)}
/>
```

## Styling

All components use:
- **Chakra UI** for base components
- **Tailwind CSS** for utility styling
- **X-like design system** from globals.css
- **Political color palette** for alignment indicators
- **Influence metrics styling** for visual hierarchy

## TypeScript Support

All components are fully typed with:
- Proper interface definitions
- Generic type support
- Strict type checking
- IntelliSense support

## Integration

Components integrate with:
- **API client** (`@/services/api`) for backend communication
- **Type system** (`@/types`) for consistent data structures
- **NextAuth.js** for session management
- **Form validation** with react-hook-form and Zod

## Accessibility

All components include:
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- Error announcements

## Configuration

Use the `AUTH_VALIDATION`, `AUTH_ERRORS`, and `AUTH_CLASSES` constants for:
- Form validation rules
- Error message consistency
- CSS class standardization

## Best Practices

1. Always handle loading and error states
2. Provide user feedback for all actions
3. Validate forms client-side and server-side
4. Use proper TypeScript types
5. Follow accessibility guidelines
6. Test across different screen sizes