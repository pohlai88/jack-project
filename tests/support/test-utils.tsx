/**
 * Test Utilities
 *
 * Custom render function with all providers and common mock utilities.
 *
 * For type-safe mock factories, use the exports from './mock-factories':
 * - createMockSession, createMockAdminSession
 * - createTypedAuthMock
 * - createMockTenant
 * - Type guards: isSession, hasEmail
 */

import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';

import { applySettingsDefaults } from '@/shared/lib/tenant-settings';
import { type TenantContextValue, TenantProvider } from '@/shared/providers';

// Re-export all type-safe mock factories
export * from './mock-factories';

// ============================================================================
// Mock Data (Legacy - prefer createMockSession from mock-factories)
// ============================================================================

export const mockTenant: TenantContextValue = {
  slug: 'test-tenant',
  id: 'tenant-123',
  name: 'Test Tenant',
  settings: applySettingsDefaults({}),
};

/**
 * @deprecated Use createMockSession() from mock-factories for type-safe mocks
 */
export const mockSession = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
    roles: {
      'test-tenant': 'member' as const,
    },
    permissions: {},
  },
  expires: new Date(Date.now() + 86400000).toISOString(),
};

/**
 * @deprecated Use createMockAdminSession() from mock-factories for type-safe mocks
 */
export const mockAdminSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    roles: {
      'test-tenant': 'admin' as const,
    },
  },
};

// ============================================================================
// Mock Messages (i18n)
// ============================================================================

export const mockMessages = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    close: 'Close',
    processing: 'Processing...',
    error: 'An error occurred',
    success: 'Success',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    noResults: 'No results found',
    actions: 'Actions',
  },
  nav: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    skills: 'Skills',
    team: 'Team',
    admin: 'Admin',
    settings: 'Settings',
    logout: 'Sign Out',
  },
  auth: {
    login: 'Sign In',
    loginTitle: 'Welcome Back',
    loginDescription: 'Sign in to your account',
    logout: 'Sign Out',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    signInWithGoogle: 'Sign in with Google',
    signInWithGithub: 'Sign in with GitHub',
    orContinueWith: 'Or continue with',
  },
  profile: {
    title: 'Profile',
    tabs: {
      overview: 'Overview',
      skills: 'Skills',
      evidence: 'Evidence',
      interests: 'Learning Interests',
    },
    skills: {
      title: 'Your Skills',
      noSkills: 'No skills yet',
      addSkill: 'Add Skill',
    },
    evidence: {
      title: 'Evidence',
      noEvidence: 'No evidence yet',
      uploadEvidence: 'Upload Evidence',
    },
    interests: {
      title: 'Learning Interests',
      description: 'Skills you want to learn or improve',
    },
  },
  skills: {
    title: 'Skills',
    category: {
      technical: 'Technical',
      soft: 'Soft Skills',
      domain: 'Domain',
      language: 'Language',
      certification: 'Certification',
    },
  },
  evidence: {
    title: 'Evidence',
    uploadCV: 'Upload CV',
    processing: 'Processing...',
    skills: 'Skills',
  },
  onboarding: {
    welcome: 'Welcome!',
    welcomeSubtitle: 'Let us get to know your skills',
    steps: {
      upload: 'Upload CV',
      processing: 'Processing',
      complete: 'Complete',
    },
    uploadStep: {
      title: 'Upload Your CV',
      description: 'We will analyze your CV to identify your skills',
    },
    processingStep: {
      title: 'Analyzing Your CV',
      description: 'AI is extracting skills from your CV',
    },
    completeStep: {
      title: 'Analysis Complete!',
      description: 'We found skills from your CV',
    },
    skipUpload: 'Skip for now',
    continueToProfile: 'Continue to Profile',
  },
  admin: {
    title: 'Admin Panel',
    skills: {
      title: 'Skills Management',
      pending: 'Pending Approval',
      approve: 'Approve',
      reject: 'Reject',
    },
    members: {
      title: 'Members',
      invite: 'Invite Member',
    },
    invites: {
      title: 'Invitations',
      createInvite: 'Create Invitation',
    },
  },
};

// ============================================================================
// Provider Wrapper
// ============================================================================

interface AllProvidersProps {
  children: ReactNode;
  session?: typeof mockSession | null;
  tenant?: TenantContextValue;
  messages?: typeof mockMessages;
  locale?: string;
}

/**
 * Simple provider wrapper for tests
 *
 * Note: We don't include SessionProvider, NextIntlClientProvider, or ThemeProvider here
 * because they're complex to set up in Vitest and should be mocked at the module level instead.
 * This keeps tests fast and focused on component logic.
 */
function AllProviders({ children, tenant = mockTenant }: AllProvidersProps) {
  return <TenantProvider value={tenant}>{children}</TenantProvider>;
}

// ============================================================================
// Custom Render
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: typeof mockSession | null;
  tenant?: TenantContextValue;
  messages?: typeof mockMessages;
  locale?: string;
}

/**
 * Custom render function that wraps components with all necessary providers
 *
 * @example
 * const { getByText } = renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { session, tenant, messages, locale, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders session={session} tenant={tenant} messages={messages} locale={locale}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// ============================================================================
// Mock Utilities
// ============================================================================

/**
 * Creates a mock fetch function that returns specified responses
 */
export function createMockFetch(responses: Record<string, unknown>) {
  return vi.fn((url: string) => {
    const urlKey = Object.keys(responses).find((key) => url.includes(key));
    const response = urlKey ? responses[urlKey] : { error: 'Not found' };

    return Promise.resolve({
      ok: !('error' in (response as Record<string, unknown>)),
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    });
  });
}

/**
 * Waits for a condition to be true
 */
export async function waitForCondition(condition: () => boolean, timeout = 5000, interval = 100): Promise<void> {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Condition not met within timeout');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Creates a mock router object for next/navigation
 */
export function createMockRouter(overrides: Partial<ReturnType<typeof import('next/navigation').useRouter>> = {}) {
  return {
    back: vi.fn(),
    forward: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    ...overrides,
  };
}

/**
 * Creates mock search params
 */
export function createMockSearchParams(params: Record<string, string> = {}) {
  return {
    get: vi.fn((key: string) => params[key] || null),
    getAll: vi.fn((key: string) => (params[key] ? [params[key]] : [])),
    has: vi.fn((key: string) => key in params),
    keys: vi.fn(() => Object.keys(params)[Symbol.iterator]()),
    values: vi.fn(() => Object.values(params)[Symbol.iterator]()),
    entries: vi.fn(() => Object.entries(params)[Symbol.iterator]()),
    forEach: vi.fn((callback: (value: string, key: string) => void) => {
      Object.entries(params).forEach(([key, value]) => callback(value, key));
    }),
    toString: vi.fn(() => new URLSearchParams(params).toString()),
    size: Object.keys(params).length,
  };
}

// ============================================================================
// Database Mocks
// ============================================================================

export const mockDb = {
  query: {
    skills: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
    },
    persons: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
    },
    tenants: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
    },
    assessments: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
    },
  },
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

/**
 * Resets all mock functions in mockDb
 */
export function resetDbMocks() {
  Object.values(mockDb.query).forEach((queryObj) => {
    Object.values(queryObj).forEach((fn) => {
      if (vi.isMockFunction(fn)) {
        fn.mockReset();
      }
    });
  });
  mockDb.select.mockReset().mockReturnThis();
  mockDb.from.mockReset().mockReturnThis();
  mockDb.where.mockReset().mockReturnThis();
  mockDb.limit.mockReset().mockResolvedValue([]);
  mockDb.insert.mockReset().mockReturnThis();
  mockDb.values.mockReset().mockReturnThis();
  mockDb.returning.mockReset().mockResolvedValue([]);
  mockDb.update.mockReset().mockReturnThis();
  mockDb.set.mockReset().mockReturnThis();
  mockDb.delete.mockReset().mockReturnThis();
}
