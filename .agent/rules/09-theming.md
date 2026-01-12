---
alwaysApply: true
---

# Theming

## Theme System

| Feature | Implementation |
|---------|----------------|
| Provider | `ThemeProvider` in `@/components/providers/theme-provider.tsx` |
| Library | `next-themes` |
| Mode | Class-based (`<html class="dark">`) |
| Default | System preference |
| Storage | `localStorage` |

## Available Themes

### Color Themes (13 total)

| Theme | Description |
|-------|-------------|
| Neutral | Default, balanced |
| Stone | Warm gray |
| Zinc | Cool gray |
| Gray | Pure gray |
| Slate | Blue-gray |
| Red | Red accent |
| Rose | Pink accent |
| Orange | Orange accent |
| Green | Green accent |
| Blue | Blue accent |
| Yellow | Yellow accent |
| Violet | Purple accent |
| Dracula | Special dark theme |

### Light/Dark Modes

Each color theme supports both light and dark modes.

## Theme Tokens (MUST USE)

**Never hardcode colors.** Always use CSS variables via Tailwind classes:

| Use Case | Token |
|----------|-------|
| Background | `bg-background` |
| Foreground (text) | `text-foreground` |
| Card background | `bg-card` |
| Card text | `text-card-foreground` |
| Primary button | `bg-primary text-primary-foreground` |
| Secondary | `bg-secondary text-secondary-foreground` |
| Muted text | `text-muted-foreground` |
| Muted background | `bg-muted` |
| Accent (hover) | `bg-accent text-accent-foreground` |
| Destructive | `bg-destructive text-destructive-foreground` |
| Border | `border-border` |
| Input border | `border-input` |
| Ring (focus) | `ring-ring` |

## Usage Examples

### Basic Layout

```tsx
<div className="bg-background text-foreground min-h-screen">
  <header className="border-b border-border">
    <nav className="bg-card text-card-foreground">
      {/* Navigation */}
    </nav>
  </header>
  <main className="container mx-auto">
    {children}
  </main>
</div>
```

### Card Component

```tsx
<div className="bg-card text-card-foreground rounded-lg border border-border p-4 shadow-sm">
  <h2 className="text-lg font-semibold">{title}</h2>
  <p className="text-muted-foreground">{description}</p>
</div>
```

### Interactive Elements

```tsx
// Button with hover state
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</button>

// Link with hover
<a className="text-foreground hover:text-accent-foreground hover:bg-accent">
  Link
</a>

// Input field
<input className="border-input bg-background text-foreground placeholder:text-muted-foreground" />
```

### Focus States

```tsx
// Focus ring pattern
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Focusable
</button>
```

## Theme Toggle

```tsx
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

## Color Theme Selector

```tsx
import { ThemeSelector } from "@/components/ui/theme/theme-selector";

// Renders dropdown with all 13 color themes
<ThemeSelector />
```

## Best Practices

1. **Never hardcode colors** - Always use tokens
2. **Test both modes** - Verify light and dark
3. **Use semantic tokens** - `bg-card` not `bg-white`
4. **Check contrast** - AA minimum (4.5:1)
5. **Use `hover:` states** - For interactive elements
6. **Use `focus-visible:`** - For keyboard navigation

## Anti-Patterns

```tsx
// ❌ WRONG: Hardcoded colors
<div className="bg-white text-black">

// ❌ WRONG: Hardcoded dark mode colors
<div className="bg-gray-900 text-white">

// ❌ WRONG: Using Tailwind color directly
<div className="bg-slate-100 text-slate-900">

// ✅ CORRECT: Using theme tokens
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-muted text-muted-foreground">
```

## CSS Variables

Theme tokens are defined as CSS variables in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

Tailwind uses these via `hsl(var(--token))`.
