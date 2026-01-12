---
alwaysApply: true
---

# MCP Tools Usage (MANDATORY)

## Overview

**CRITICAL: Always use MCP (Model Context Protocol) tools when available. This is MANDATORY.**

Before creating any component, hook, or feature, check MCP tools first.

## Available MCP Servers

| Server | Purpose |
|--------|---------|
| **shadcn MCP** | Add/manage shadcn/ui components |
| **GitHub MCP** | Repository management, issues, PRs |
| **Next.js DevTools MCP** | Documentation, diagnostics |
| **Browser Extension MCP** | Browser automation, testing |

## shadcn MCP Workflow

**ALWAYS follow this workflow before creating UI components:**

### Step 1: Search for Component

```typescript
mcp_shadcn_search_items_in_registries({
  registries: ["@shadcn"],
  query: "hover-card"
})
```

### Step 2: Get Installation Command

```typescript
mcp_shadcn_get_add_command_for_items({
  items: ["@shadcn/hover-card"]
})
```

### Step 3: Get Usage Examples

```typescript
mcp_shadcn_get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "hover-card-demo"
})
```

### Step 4: Install and Use

Only create custom component if MCP doesn't provide solution.

## Common MCP Tasks

| Task | Tool |
|------|------|
| Add UI component | `mcp_shadcn_search_items_in_registries` |
| Get install command | `mcp_shadcn_get_add_command_for_items` |
| Get examples | `mcp_shadcn_get_item_examples_from_registries` |
| Check Next.js docs | `mcp_next-devtools_nextjs_docs` |
| Search codebase | `mcp_github_search_code` |
| Create GitHub issue | `mcp_github_issue_write` |
| Test in browser | `mcp_cursor-browser-extension_browser_navigate` |

## Example Workflow

**User request:** "Add a hover card component"

**WRONG approach:**
1. Create custom `hover-card.tsx`
2. Write custom styles
3. May miss best practices

**CORRECT approach:**
1. Search: `mcp_shadcn_search_items_in_registries({ query: "hover-card" })`
2. Install: `mcp_shadcn_get_add_command_for_items({ items: ["@shadcn/hover-card"] })`
3. Examples: `mcp_shadcn_get_item_examples_from_registries({ query: "hover-card-demo" })`
4. Use the installed component

## Animated Components

For animated Radix components, use `@animate-ui`:

```typescript
// Animated tooltip
mcp_shadcn_search_items_in_registries({
  registries: ["@animate-ui"],
  query: "tooltip"
})

// Animated tabs
mcp_shadcn_search_items_in_registries({
  registries: ["@animate-ui"],
  query: "tabs"
})
```

These are already installed at:
- `@/components/animate-ui/components/radix/tooltip`
- `@/components/animate-ui/components/radix/tabs`

## Next.js DevTools MCP

For Next.js documentation and diagnostics:

```typescript
// Search docs
mcp_next-devtools_nextjs_docs({
  action: "search",
  query: "app router"
})

// Get specific docs
mcp_next-devtools_nextjs_docs({
  action: "get",
  path: "/docs/app/building-your-application/routing"
})

// Check running dev server
mcp_next-devtools_nextjs_index()
```

## GitHub MCP

For repository operations:

```typescript
// Search code
mcp_github_search_code({
  query: "useStudios language:typescript"
})

// Create issue
mcp_github_issue_write({
  method: "create",
  owner: "owner",
  repo: "repo",
  title: "Issue title",
  body: "Issue description"
})
```

## Browser MCP

For testing and automation:

```typescript
// Navigate
mcp_cursor-browser-extension_browser_navigate({
  url: "http://localhost:3001"
})

// Take snapshot
mcp_cursor-browser-extension_browser_snapshot()

// Click element
mcp_cursor-browser-extension_browser_click({
  element: "Submit button",
  ref: "button[type='submit']"
})
```

## Consequences of NOT Using MCP

Failure to use MCP tools results in:

- ❌ Incomplete implementations
- ❌ Incorrect patterns
- ❌ Missing best practices
- ❌ Duplicate code
- ❌ Inconsistent components

## Best Practices

1. **Search first** - Before creating anything
2. **Use official examples** - MCP provides tested code
3. **Follow patterns** - MCP code follows conventions
4. **Stay updated** - MCP provides latest docs
5. **Test properly** - Use browser MCP for testing

## Checklist Before Creating

- [ ] Searched shadcn MCP for existing component
- [ ] Checked animate-ui for animated variants
- [ ] Reviewed Next.js docs via MCP
- [ ] No MCP solution available
- [ ] Creating custom is justified

---

**Remember: MCP tools are your FIRST choice, not last resort!**
