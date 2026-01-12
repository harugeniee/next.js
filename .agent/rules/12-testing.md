---
alwaysApply: true
---

# Testing

## Stack

| Tool | Purpose |
|------|---------|
| Jest | Test runner |
| @testing-library/react | React testing utilities |
| @testing-library/user-event | User interaction simulation |
| @testing-library/jest-dom | DOM matchers |

## Configuration

Located in `jest.config.js`:

```javascript
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Test Location

Tests are in `src/__tests__/`:

```
src/__tests__/
├── admin/
│   ├── genres/
│   └── genres.spec.tsx
├── auth/
└── features/
    └── stickers/
```

## Commands

```bash
yarn test             # Run all tests
yarn test:watch       # Watch mode
yarn test:coverage    # Coverage report
```

## Test Structure

```tsx
// src/__tests__/admin/genres.spec.tsx
import { render, screen } from "@testing-library/react";
import GenresAdminPage from "@/app/admin/genres/page";

// Mock hooks
jest.mock("next/navigation", () => ({
  usePathname: () => "/admin/genres",
}));

jest.mock("@/hooks/ui/use-page-metadata", () => ({
  usePageMetadata: jest.fn(),
}));

jest.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string, namespace: string = "common") => {
      // Return mock translation
      return key;
    },
  }),
}));

describe("GenresAdminPage", () => {
  it("renders the page title", () => {
    render(<GenresAdminPage />);
    expect(screen.getByText("Genres Management")).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<GenresAdminPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Genres Management");
  });
});
```

## Mocking Patterns

### Mock i18n Provider

```tsx
jest.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string, namespace: string = "common") => {
      // Load actual translations for more realistic tests
      if (namespace === "admin") {
        const admin = require("@/i18n/locales/en/admin.json");
        const keys = key.split(".");
        let value = admin;
        for (const k of keys) {
          value = value?.[k];
        }
        return typeof value === "string" ? value : key;
      }
      return key;
    },
  }),
}));
```

### Mock Next.js Navigation

```tsx
jest.mock("next/navigation", () => ({
  usePathname: () => "/admin/genres",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({
    id: "123",
  }),
}));
```

### Mock Custom Hooks

```tsx
jest.mock("@/hooks/ui/use-page-metadata", () => ({
  usePageMetadata: jest.fn(),
}));

jest.mock("@/hooks/ui/useBreadcrumb", () => ({
  useBreadcrumb: jest.fn(() => [
    { label: "Admin", href: "/admin" },
    { label: "Genres", href: "/admin/genres" },
  ]),
}));
```

### Mock HTTP Client

```tsx
jest.mock("@/lib/http/client", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
```

### Mock TanStack Query

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

// Use in tests
render(<MyComponent />, { wrapper });
```

## Testing Patterns

### Component Rendering

```tsx
it("renders correctly", () => {
  render(<MyComponent />);
  expect(screen.getByText("Expected text")).toBeInTheDocument();
});
```

### User Interactions

```tsx
import userEvent from "@testing-library/user-event";

it("handles click", async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  
  render(<Button onClick={onClick}>Click me</Button>);
  await user.click(screen.getByRole("button"));
  
  expect(onClick).toHaveBeenCalled();
});
```

### Form Submission

```tsx
it("submits form", async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<MyForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText("Name"), "Test");
  await user.click(screen.getByRole("button", { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({ name: "Test" });
});
```

### Async Operations

```tsx
it("loads data", async () => {
  render(<DataComponent />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
  
  expect(screen.getByText("Data loaded")).toBeInTheDocument();
});
```

## What to Test

| Priority | What to Test |
|----------|--------------|
| High | Critical user flows (auth, forms) |
| High | Component rendering |
| Medium | User interactions |
| Medium | Error states |
| Low | Styling/layout |

## Coverage Threshold

Minimum 80% coverage required:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Best Practices

1. **Mock external dependencies** - i18n, navigation, HTTP
2. **Use Testing Library queries** - `getByRole`, `getByText`
3. **Test user behavior** - Not implementation details
4. **Use `userEvent`** - Over `fireEvent` for realistic interactions
5. **Wait for async** - Use `waitFor` for async operations
6. **Keep tests focused** - One assertion per test when possible

## Anti-Patterns

```tsx
// ❌ WRONG: Testing implementation details
expect(component.state.isOpen).toBe(true);

// ❌ WRONG: Using container queries
const { container } = render(<Component />);
container.querySelector(".my-class");

// ❌ WRONG: Not waiting for async
render(<AsyncComponent />);
expect(screen.getByText("Data")).toBeInTheDocument(); // May fail

// ✅ CORRECT: Test user-visible behavior
expect(screen.getByRole("button")).toBeInTheDocument();

// ✅ CORRECT: Wait for async
await waitFor(() => {
  expect(screen.getByText("Data")).toBeInTheDocument();
});
```
