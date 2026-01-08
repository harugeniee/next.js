---
alwaysApply: true
---

# Responsive Design (Mobile-First)

## Breakpoints

Tailwind CSS default breakpoints (mobile-first):

| Prefix | Min Width | Use Case |
|--------|-----------|----------|
| (base) | < 640px | Mobile phones |
| `sm:` | ≥ 640px | Large phones, small tablets |
| `md:` | ≥ 768px | Tablets |
| `lg:` | ≥ 1024px | Small laptops, desktops |
| `xl:` | ≥ 1280px | Large desktops |
| `2xl:` | ≥ 1536px | Extra large screens |

## Mobile-First Approach

**Base styles = mobile (< 640px)**. Scale up progressively.

```tsx
// ✅ CORRECT: Mobile-first
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  {/* Starts small, gets larger at each breakpoint */}
</div>

// ❌ WRONG: Desktop-first
<div className="text-xl lg:text-lg md:text-base sm:text-sm">
  {/* Don't do this */}
</div>
```

## Layout Patterns

### Grid Layouts

```tsx
// Responsive grid: 1 → 2 → 3 → 4 columns
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Flex Layouts

```tsx
// Stack on mobile, row on tablet+
<div className="flex flex-col gap-4 sm:flex-row">
  <Sidebar />
  <Main />
</div>
```

### Container

```tsx
// Responsive container with padding
<div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
  {children}
</div>
```

## Spacing Patterns

### Padding

```tsx
<section className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
  {content}
</section>
```

### Vertical Spacing

```tsx
<div className="py-4 sm:py-5 md:py-6 lg:py-8">
  {content}
</div>
```

### Gap

```tsx
<div className="space-y-4 sm:space-y-5 md:space-y-6">
  {/* Vertical spacing between children */}
</div>

<div className="gap-4 sm:gap-5 md:gap-6">
  {/* For grid/flex */}
</div>
```

## Typography

```tsx
// Responsive text sizes
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Page Title
</h1>

<p className="text-sm sm:text-base md:text-lg">
  Body text
</p>
```

## Visibility

```tsx
// Hide on mobile, show on tablet+
<div className="hidden md:block">
  Desktop content
</div>

// Show on mobile, hide on tablet+
<div className="block md:hidden">
  Mobile content
</div>
```

## Page Layout Example

```tsx
<section className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-8">
  {/* Header */}
  <div className="mb-4 sm:mb-5 md:mb-6">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
      {t("pageTitle", "namespace")}
    </h1>
    <p className="text-sm sm:text-base text-muted-foreground mt-2">
      {t("pageDescription", "namespace")}
    </p>
  </div>
  
  {/* Content grid */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {items.map(item => (
      <Card key={item.id} className="p-3 sm:p-4">
        {/* Card content */}
      </Card>
    ))}
  </div>
</section>
```

## Image Optimization

```tsx
import Image from "next/image";

<Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

## Touch Targets

Minimum 48px for touch targets on mobile:

```tsx
<button className="min-h-[48px] min-w-[48px] p-3 sm:p-2">
  {/* Touch-friendly button */}
</button>
```

## Best Practices

1. **Start mobile** - Base styles for smallest screens
2. **Scale up** - Add breakpoint modifiers progressively
3. **Use container** - `container mx-auto` for centered content
4. **Responsive padding** - Increase at each breakpoint
5. **Test all sizes** - Verify at each breakpoint
6. **Touch targets** - ≥48px on mobile

## Anti-Patterns

```tsx
// ❌ WRONG: Desktop-first
<div className="grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">

// ❌ WRONG: Fixed widths
<div className="w-[500px]">

// ❌ WRONG: Using max-width media queries
// (Tailwind uses min-width by default)

// ❌ WRONG: Small touch targets
<button className="p-1 text-xs">  {/* Too small for touch */}

// ✅ CORRECT: Mobile-first with adequate touch targets
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
<button className="p-3 sm:p-2">
```
