# Create Test File

Create a Jest + React Testing Library test file.

## Arguments
- `$ARGUMENTS`: Component or page path (e.g., "admin/publishers" or "components/features/publishers/publishers-list")

## Instructions

Parse `$ARGUMENTS` to extract the test target and create appropriate test file.

### 1. Create Test File

For pages: `src/__tests__/{path}.spec.tsx`
For components: `src/__tests__/components/{path}.spec.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import the component/page to test
import {ComponentName} from "@/path/to/component";

// Import locale files for mocking i18n
import admin from "@/i18n/locales/en/admin.json";
import common from "@/i18n/locales/en/common.json";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/current/path",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock usePageMetadata hook
jest.mock("@/hooks/ui/use-page-metadata", () => ({
  usePageMetadata: jest.fn(),
}));

// Mock useBreadcrumb hook
jest.mock("@/hooks/ui/useBreadcrumb", () => ({
  useBreadcrumb: jest.fn(() => [
    { label: "Admin", href: "/admin" },
    { label: "Current Page", href: "/current/path" },
  ]),
}));

// Mock useI18n hook
jest.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string, namespace: string = "common") => {
      const locales: Record<string, Record<string, unknown>> = { admin, common };
      const locale = locales[namespace];

      if (!locale) return key;

      const keys = key.split(".");
      let value: Record<string, unknown> | unknown = locale;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }

      return typeof value === "string" ? value : key;
    },
    locale: "en",
    setLocale: jest.fn(),
  }),
}));

// Mock data hooks (customize based on your component)
jest.mock("@/hooks/admin/use{Entities}", () => ({
  use{Entities}: () => ({
    listQuery: {
      data: {
        result: [
          { id: "1", name: "Test Item 1", status: "active" },
          { id: "2", name: "Test Item 2", status: "inactive" },
        ],
        metaData: { currentPage: 1, totalPages: 1, totalRecords: 2 },
      },
      isLoading: false,
      error: null,
    },
    create: { mutateAsync: jest.fn(), isPending: false },
    update: { mutateAsync: jest.fn(), isPending: false },
    remove: { mutateAsync: jest.fn(), isPending: false },
  }),
}));

/**
 * {ComponentName} Tests
 * Tests the {description}
 */
describe("{ComponentName}", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component correctly", () => {
      render(<{ComponentName} />);

      // Check for main elements
      expect(screen.getByText("Expected Title")).toBeInTheDocument();
      expect(screen.getByText("Expected Description")).toBeInTheDocument();
    });

    it("renders loading state", () => {
      // Mock loading state
      jest.mock("@/hooks/admin/use{Entities}", () => ({
        use{Entities}: () => ({
          listQuery: { data: undefined, isLoading: true, error: null },
        }),
      }));

      render(<{ComponentName} />);

      // Check for loading indicators
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders empty state when no data", () => {
      // Mock empty data
      jest.mock("@/hooks/admin/use{Entities}", () => ({
        use{Entities}: () => ({
          listQuery: {
            data: { result: [], metaData: { totalRecords: 0 } },
            isLoading: false,
          },
        }),
      }));

      render(<{ComponentName} />);

      expect(screen.getByText(/no items/i)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("handles create button click", async () => {
      const user = userEvent.setup();
      render(<{ComponentName} />);

      const createButton = screen.getByRole("button", { name: /create/i });
      await user.click(createButton);

      // Check dialog opens
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("handles form submission", async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();

      render(<{ComponentName} onSubmit={mockSubmit} />);

      // Fill form
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Test Name");

      // Submit form
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Test Name" })
        );
      });
    });

    it("handles delete action", async () => {
      const user = userEvent.setup();
      const mockDelete = jest.fn();
      window.confirm = jest.fn(() => true);

      render(<{ComponentName} onDelete={mockDelete} />);

      // Find and click delete button
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<{ComponentName} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("has accessible form labels", () => {
      render(<{ComponentName} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<{ComponentName} />);

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toHaveAttribute("type", "text");

      await user.tab();
      expect(document.activeElement).toHaveAttribute("type", "submit");
    });
  });

  describe("Edge Cases", () => {
    it("handles error state", () => {
      jest.mock("@/hooks/admin/use{Entities}", () => ({
        use{Entities}: () => ({
          listQuery: {
            data: undefined,
            isLoading: false,
            error: new Error("Failed to fetch"),
          },
        }),
      }));

      render(<{ComponentName} />);

      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    it("handles long text gracefully", () => {
      const longName = "A".repeat(300);

      render(<{ComponentName} data={{ name: longName }} />);

      // Text should be truncated or wrapped
      expect(screen.getByText(/A+/)).toBeInTheDocument();
    });
  });
});
```

## Test Utilities

### Custom Render with Providers

```typescript
// src/__tests__/utils/test-utils.tsx
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement, ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

### Mock Factories

```typescript
// src/__tests__/utils/mock-data.ts
export const createMock{Entity} = (overrides = {}) => ({
  id: "test-id",
  name: "Test Name",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockList = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    createMock{Entity}({ id: `id-${i}`, name: `Item ${i + 1}` })
  );
```

## Common Assertions

```typescript
// Element exists
expect(screen.getByText("text")).toBeInTheDocument();

// Element does not exist
expect(screen.queryByText("text")).not.toBeInTheDocument();

// Element has class
expect(element).toHaveClass("class-name");

// Element has attribute
expect(element).toHaveAttribute("aria-label", "label");

// Input has value
expect(input).toHaveValue("value");

// Button is disabled
expect(button).toBeDisabled();

// Async wait for element
await waitFor(() => expect(screen.getByText("text")).toBeInTheDocument());

// Check mock called
expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ key: "value" }));
```

## Reference

- Pattern: `src/__tests__/admin/genres.spec.tsx`
- Jest config: `jest.config.mjs`
- Testing Library: https://testing-library.com/docs/react-testing-library/intro
- Rule: `.cursor/rules/12-testing.mdc`
