---
alwaysApply: true
---

# Forms & Validation

## Stack

| Tool | Purpose |
|------|---------|
| React Hook Form | Form state management |
| Zod | Schema validation |
| @hookform/resolvers | Connect Zod to RHF |
| shadcn Form | UI components |

## Basic Form Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import { Input } from "@/components/ui/core/input";
import { Button } from "@/components/ui/core/button";

// 1. Define schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

// 2. Create component
export function MyForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const { t } = useI18n();
  
  // 3. Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // 4. Handle submit
  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast.success(t("success.saved", "common"));
      form.reset();
    } catch (error) {
      toast.error(t("error.failed", "common"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name", "common")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.namePlaceholder", "common")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.email", "common")}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("actions.saving", "common") : t("actions.save", "common")}
        </Button>
      </form>
    </Form>
  );
}
```

## Zod Schemas

Located in `@/lib/validators/`:

### Auth Schemas (`@/lib/validators/auth.ts`)

```typescript
import { z } from "zod";

// Base schemas
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password must be less than 128 characters");

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Signup schema with password confirmation
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
```

### Entity Schemas

```typescript
// src/lib/validators/series.ts
import { z } from "zod";

export const createSeriesSchema = z.object({
  title: z.object({
    romaji: z.string().optional(),
    english: z.string().min(1, "English title is required"),
    native: z.string().optional(),
  }),
  type: z.enum(["MANGA", "ANIME", "NOVEL"]),
  description: z.string().optional(),
  startDate: z.date().optional(),
  genreIds: z.array(z.string()).optional(),
});

export type CreateSeriesFormData = z.infer<typeof createSeriesSchema>;
```

## Form with Mutation

```tsx
import { useCreateSeries } from "@/hooks/series/useSeriesQuery";

export function CreateSeriesForm() {
  const { t } = useI18n();
  const createSeries = useCreateSeries();
  
  const form = useForm<CreateSeriesFormData>({
    resolver: zodResolver(createSeriesSchema),
  });

  const handleSubmit = async (data: CreateSeriesFormData) => {
    await createSeries.mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Fields */}
        <Button 
          type="submit" 
          disabled={createSeries.isPending}
        >
          {createSeries.isPending ? "Creating..." : "Create Series"}
        </Button>
      </form>
    </Form>
  );
}
```

## Form in Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog";

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onSave: (data: FormData) => Promise<void>;
}

export function EditDialog({ open, onOpenChange, item, onSave }: EditDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: item || { name: "", email: "" },
  });

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      form.reset(item);
    }
  }, [item, form]);

  const handleSubmit = async (data: FormData) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Create"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Fields */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Validation Patterns

### Conditional Validation

```typescript
const schema = z.object({
  type: z.enum(["email", "phone"]),
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === "email") return !!data.email;
    if (data.type === "phone") return !!data.phone;
    return true;
  },
  { message: "Required field missing", path: ["email"] }
);
```

### Array Validation

```typescript
const schema = z.object({
  tags: z.array(z.string()).min(1, "At least one tag required"),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  })).max(10, "Maximum 10 images"),
});
```

### Date Validation

```typescript
const schema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: "End date must be after start date", path: ["endDate"] }
);
```

## Best Practices

1. **Always use `zodResolver`** - Connects Zod to RHF
2. **Define schemas in `@/lib/validators/`** - Centralized validation
3. **Export types with schemas** - `z.infer<typeof schema>`
4. **Disable submit while pending** - `disabled={form.formState.isSubmitting}`
5. **Show loading state** - Change button text during submission
6. **Reset form on success** - `form.reset()` after successful submit
7. **Use FormMessage** - Displays validation errors automatically
8. **Handle errors with toast** - Show user-friendly error messages

## Anti-Patterns

```tsx
// ❌ WRONG: Not using zodResolver
const form = useForm<FormData>({
  // Missing resolver
});

// ❌ WRONG: Not disabling submit button
<Button type="submit">Submit</Button>

// ❌ WRONG: Not handling errors
const handleSubmit = async (data) => {
  await mutation.mutateAsync(data);  // No try/catch
};

// ❌ WRONG: Inline schema definition
const form = useForm({
  resolver: zodResolver(z.object({ name: z.string() })),  // Define separately
});
```
