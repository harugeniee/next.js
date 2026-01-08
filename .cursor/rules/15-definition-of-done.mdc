---
alwaysApply: true
---

# Definition of Done (DoD)

## Checklist

Before marking any task as complete, verify all applicable items:

### MCP Tools (MANDATORY)

- [ ] Checked MCP tools for existing solutions before creating new code
- [ ] Used shadcn MCP for UI components when applicable
- [ ] Used Next.js MCP for documentation and diagnostics
- [ ] No duplicate implementations of MCP-available functionality

### Code Quality

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] No console errors or warnings
- [ ] Code follows project structure and naming conventions
- [ ] Components ≤ 200 lines
- [ ] Files ≤ 300 lines

### Architecture

- [ ] No Server Actions (`"use server"`)
- [ ] No `app/api/*` routes
- [ ] No secrets in client code
- [ ] Only `NEXT_PUBLIC_*` environment variables
- [ ] All network calls through `@/lib/http/client.ts`
- [ ] Uses `@/` alias for imports (no deep relative paths)

### Data & State

- [ ] Uses TanStack Query for server state
- [ ] Uses query key factory from `@/lib/utils/query-keys.ts`
- [ ] Uses Jotai for client state when needed
- [ ] Proper loading states implemented
- [ ] Error handling with toast notifications

### Theming & UI

- [ ] Theme works in both dark/light modes
- [ ] Uses shadcn tokens (no hardcoded colors)
- [ ] AA contrast minimum in both themes
- [ ] Uses shadcn primitives with proper loading/disabled/error states

### Responsive Design

- [ ] Mobile-first responsive layout
- [ ] Scales properly at `sm`/`md`/`lg`/`xl`/`2xl` breakpoints
- [ ] Touch targets ≥ 48px on mobile
- [ ] Tested on mobile, tablet, and desktop viewports

### Internationalization

- [ ] No hard-coded text in components
- [ ] i18n keys present for both EN & VI
- [ ] Uses `useI18n()` hook with namespace parameter
- [ ] Translation keys verified (exist in JSON structure)
- [ ] Namespace correct (`common` for actions, domain for domain content)
- [ ] Both locales updated (EN and VI)

### Accessibility

- [ ] Proper semantic HTML and ARIA labels
- [ ] Keyboard navigation works (Tab, ESC, Enter)
- [ ] Focus ring visible on interactive elements
- [ ] Screen reader friendly
- [ ] `aria-live` for async feedback

### Forms (if applicable)

- [ ] Form validation with Zod
- [ ] Uses `react-hook-form` + shadcn Form components
- [ ] Submit button disabled while pending
- [ ] Clear error messages shown to users
- [ ] Form resets on success

### Animation & Loading (if applicable)

- [ ] Animation components used (AnimatedSection/Grid/Header)
- [ ] Skeletonize with placeholder divs
- [ ] Loading and data props passed to animation components
- [ ] Skeleton visible during loading
- [ ] No animation conflicts with skeleton

### Testing

- [ ] Tests for critical flows
- [ ] Coverage ≥ 80% (if adding new functionality)
- [ ] Tests pass: `yarn test`

### Performance

- [ ] Images use `next/image` with proper `sizes` attribute
- [ ] Heavy components use dynamic imports when needed
- [ ] No unnecessary re-renders

### Final Checks

- [ ] Linting passes: `yarn lint`
- [ ] Formatting applied: `yarn format`
- [ ] Type check passes: `yarn type-check`
- [ ] Build succeeds: `yarn build`
- [ ] App runs without errors: `yarn dev`

## Quick Reference Commands

```bash
# Run all checks
yarn check:all        # lint + type-check + format:check

# Individual checks
yarn lint             # ESLint
yarn type-check       # TypeScript
yarn format:check     # Prettier

# Fix issues
yarn lint:fix         # Auto-fix ESLint
yarn format           # Auto-format

# Test
yarn test             # Run tests
yarn test:coverage    # Coverage report
```

## Severity Levels

| Level | Items | Action |
|-------|-------|--------|
| **Blocker** | TS errors, ESLint errors, build fails | Must fix |
| **Critical** | No MCP check, hardcoded colors, missing i18n | Must fix |
| **Major** | Missing loading states, no error handling | Should fix |
| **Minor** | Code style, optimization | Nice to have |
