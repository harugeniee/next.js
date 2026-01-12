---
alwaysApply: true
---

# Animations & Skeleton Loading

## Animation System

| File | Purpose |
|------|---------|
| `@/lib/utils/animations.ts` | Animation variants |
| `@/components/shared/animated-section.tsx` | Section wrapper |
| `@/components/shared/animated-grid.tsx` | Grid wrapper |
| `@/components/shared/animated-header.tsx` | Header wrapper |
| `@/components/shared/skeletonize.tsx` | Skeleton wrapper |

## Animation Components

### AnimatedSection

Wrapper for page sections with fade + slide up animation.

```tsx
import { AnimatedSection } from "@/components/shared";

<AnimatedSection loading={isLoading} data={data} className="py-8">
  <h2>Section Title</h2>
  <Content />
</AnimatedSection>
```

**Props:**
- `loading` - Boolean, animation waits until false
- `data` - Data to check, animation waits until truthy
- `variants` - Custom animation variants (optional)
- `scrollTriggered` - Use `whileInView` instead of `animate` (optional)

### AnimatedGrid

Wrapper for grids with stagger animations.

```tsx
import { AnimatedGrid } from "@/components/shared";

<AnimatedGrid loading={isLoading} data={items} className="grid grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</AnimatedGrid>
```

### AnimatedHeader

Wrapper for headers with fade + slide down animation.

```tsx
import { AnimatedHeader } from "@/components/shared";

<AnimatedHeader loading={isLoading} data={data} className="mb-4">
  <h1>Page Title</h1>
</AnimatedHeader>
```

## Animation Variants

Pre-configured in `@/lib/utils/animations.ts`:

| Variant | Effect |
|---------|--------|
| `sectionVariants` | Fade + slide up |
| `containerVariants` | Stagger container |
| `itemVariants` | Stagger items |
| `headerVariants` | Fade + slide down |
| `slideRightVariants` | Slide from right |
| `fadeVariants` | Simple fade |
| `scaleVariants` | Scale from center |

**Critical:** All variants keep `opacity: 1` in `hidden` state to allow skeleton visibility during loading.

## Skeleton Loading

### Skeletonize Component

Applies shimmer animation to children during loading.

```tsx
import { Skeletonize } from "@/components/shared";

<Skeletonize loading={isLoading}>
  {data ? (
    <Content data={data} />
  ) : (
    // Placeholder divs for skeleton
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 rounded" />
      ))}
    </div>
  )}
</Skeletonize>
```

### Skeleton Rules

1. **Always provide placeholder divs**
   ```tsx
   // ❌ WRONG: No placeholder
   {data && <Content />}
   
   // ✅ CORRECT: Placeholder for skeleton
   {data ? <Content /> : <Placeholder />}
   ```

2. **Placeholder divs need dimension classes**
   ```tsx
   // ✅ Skeleton will apply to these
   <div className="h-20 rounded" />
   <div className="w-full aspect-[2/3]" />
   <div className="h-40 w-full" />
   ```

3. **CSS targets these selectors automatically:**
   - `div[class*="h-"]`
   - `div[class*="w-"]`
   - `div[class*="aspect-"]`

## Complete Usage Pattern

```tsx
import { AnimatedSection, AnimatedGrid, AnimatedHeader, Skeletonize } from "@/components/shared";

export function MyPage() {
  const { data, isLoading } = useMyQuery();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>...</Breadcrumb>
      </AnimatedSection>
      
      {/* Page Title */}
      <AnimatedHeader loading={isLoading} data={data}>
        <h1 className="text-3xl font-bold">{data?.title}</h1>
        <p className="text-muted-foreground">{data?.description}</p>
      </AnimatedHeader>
      
      {/* Content */}
      <AnimatedSection loading={isLoading} data={data}>
        <Skeletonize loading={isLoading}>
          {data ? (
            <AnimatedGrid loading={isLoading} data={data.items} className="grid grid-cols-3 gap-4">
              {data.items.map(item => (
                <Card key={item.id}>{item.name}</Card>
              ))}
            </AnimatedGrid>
          ) : (
            // Placeholder grid
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[2/3] rounded" />
              ))}
            </div>
          )}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}
```

## CSS Skeleton Styles

Located in `@/app/globals.css`:

```css
.skeletonize {
  /* Applies shimmer animation */
}

.skeletonize div[class*="h-"],
.skeletonize div[class*="w-"],
.skeletonize div[class*="aspect-"] {
  /* Skeleton shimmer effect */
  background: linear-gradient(90deg, ...);
  animation: shimmer 1.5s infinite;
}
```

## Best Practices

1. **Use animation components for all sections** - Consistent animations
2. **Always provide placeholders** - Skeletonize needs children
3. **Pass loading and data props** - Required for proper timing
4. **Keep opacity: 1 in hidden state** - Allows skeleton visibility
5. **Use dimension classes** - `h-*`, `w-*`, `aspect-*` for skeleton targeting
6. **Test skeleton visibility** - Verify skeleton shows during loading

## Anti-Patterns

```tsx
// ❌ WRONG: No placeholder for skeleton
<Skeletonize loading={isLoading}>
  {data && <Content />}
</Skeletonize>

// ❌ WRONG: Missing loading/data props
<AnimatedSection>
  <Content />
</AnimatedSection>

// ❌ WRONG: Placeholder without dimensions
<div className="rounded" />  // No h-* or w-*

// ❌ WRONG: Wrapping AnimatedSection with Skeletonize
<Skeletonize loading={isLoading}>
  <AnimatedSection>  {/* Wrong order */}
    <Content />
  </AnimatedSection>
</Skeletonize>

// ✅ CORRECT: Skeletonize inside AnimatedSection
<AnimatedSection loading={isLoading} data={data}>
  <Skeletonize loading={isLoading}>
    {data ? <Content /> : <Placeholder />}
  </Skeletonize>
</AnimatedSection>
```

## Definition of Done - Animations

- [ ] Animation components used (AnimatedSection/Grid/Header)
- [ ] Skeletonize with placeholder divs
- [ ] Loading and data props passed
- [ ] Skeleton visible during loading
- [ ] Smooth transitions when data loads
- [ ] No animation conflicts with skeleton
