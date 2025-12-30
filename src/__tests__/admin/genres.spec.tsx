import { render, screen } from "@testing-library/react";
import admin from "@/i18n/locales/en/admin.json";
import GenresAdminPage from "@/app/admin/genres/page";

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/admin/genres",
}));

// Mock the usePageMetadata and useBreadcrumb hooks
jest.mock("@/hooks/ui/use-page-metadata", () => ({
  usePageMetadata: jest.fn(),
}));
jest.mock("@/hooks/ui/useBreadcrumb", () => ({
  useBreadcrumb: jest.fn(() => [
    { label: "Admin", href: "/admin" },
    { label: "Genres Management", href: "/admin/genres" },
  ]),
}));

// Mock the useI18n hook
jest.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string, namespace: string = "common") => {
      if (namespace === "admin") {
        const keys = key.split(".");
        let value: Record<string, unknown> | unknown = admin;

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return key; // Fallback to key if not found
          }
        }

        return typeof value === "string" ? value : key;
      }
      return key;
    },
  }),
}));

/**
 * Genres Admin Page Tests
 * Tests the admin genres page rendering and functionality
 */
describe("GenresAdminPage", () => {
  it("renders the admin genres page with correct title and welcome message", () => {
    render(<GenresAdminPage />);

    // Check if the page title is rendered
    expect(screen.getByText("Genres Management")).toBeInTheDocument();

    // Check if the page description is rendered
    expect(
      screen.getByText(
        "Manage genres and genre categories for articles and series",
      ),
    ).toBeInTheDocument();

    // Check if the welcome message is rendered
    expect(
      screen.getByText(
        "Welcome to the Admin Genres page. Here you can manage all the genres available in the application.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the genre management section", () => {
    render(<GenresAdminPage />);

    // Check if the genre management section is rendered
    expect(screen.getByText("Genre Management")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create, edit, and organize genre categories to help users find content more easily.",
      ),
    ).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<GenresAdminPage />);

    // Check for proper heading hierarchy
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Genres Management");

    // Check for proper heading in management section
    const subHeading = screen.getByRole("heading", { level: 3 });
    expect(subHeading).toHaveTextContent("Genre Management");
  });
});
