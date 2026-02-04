# Create Form Component

Create a React Hook Form component with Zod validation.

## Arguments
- `$ARGUMENTS`: Form name and entity (e.g., "CreatePublisher Publisher")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{FormName}` - PascalCase form name (e.g., "CreatePublisher")
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{entity}` - camelCase (e.g., "publisher")

### 1. Create Form Component

File: `src/components/features/{domain}/{form-name}-form.tsx`

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Textarea } from "@/components/ui/core/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { {ENTITY}_CONSTANTS } from "@/lib/constants/{entity}.constants";
import { create{Entity}Schema, type Create{Entity}FormData } from "@/lib/validators/{entity}";
import type { Create{Entity}Dto } from "@/lib/interface/{entity}.interface";

interface {FormName}FormProps {
  onSubmit: (data: Create{Entity}Dto) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<Create{Entity}FormData>;
}

export function {FormName}Form({
  onSubmit,
  isLoading,
  defaultValues,
}: {FormName}FormProps) {
  const { t } = useI18n();

  const form = useForm<Create{Entity}FormData>({
    resolver: zodResolver(create{Entity}Schema),
    defaultValues: {
      name: "",
      description: "",
      status: {ENTITY}_CONSTANTS.STATUS.ACTIVE,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: Create{Entity}FormData) => {
    const submitData: Create{Entity}Dto = {
      name: data.name,
      description: data.description || undefined,
      status: data.status,
    };
    await onSubmit(submitData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("{entities}.form.name", "admin")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("{entities}.form.namePlaceholder", "admin")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("{entities}.form.description", "admin")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("{entities}.form.descriptionPlaceholder", "admin")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("{entities}.form.descriptionHint", "admin")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Select Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("{entities}.form.status", "admin")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("{entities}.form.selectStatus", "admin")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ENTITY}_CONSTANTS.STATUS.ACTIVE}>
                    {t("{entities}.status.active", "admin")}
                  </SelectItem>
                  <SelectItem value={ENTITY}_CONSTANTS.STATUS.INACTIVE}>
                    {t("{entities}.status.inactive", "admin")}
                  </SelectItem>
                  <SelectItem value={ENTITY}_CONSTANTS.STATUS.PENDING}>
                    {t("{entities}.status.pending", "admin")}
                  </SelectItem>
                  <SelectItem value={ENTITY}_CONSTANTS.STATUS.ARCHIVED}>
                    {t("{entities}.status.archived", "admin")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("actions.saving", "common") : t("{entities}.form.save", "admin")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## Common Form Field Patterns

### Text Input
```typescript
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Textarea
```typescript
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Enter description"
          className="resize-none"
          rows={4}
          {...field}
        />
      </FormControl>
      <FormDescription>Optional description text.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Select
```typescript
<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox
```typescript
<FormField
  control={form.control}
  name="isActive"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active</FormLabel>
        <FormDescription>Enable this item.</FormDescription>
      </div>
    </FormItem>
  )}
/>
```

### Switch
```typescript
<FormField
  control={form.control}
  name="notifications"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-base">Notifications</FormLabel>
        <FormDescription>Receive notifications.</FormDescription>
      </div>
      <FormControl>
        <Switch checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
    </FormItem>
  )}
/>
```

### Number Input
```typescript
<FormField
  control={form.control}
  name="sortOrder"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Sort Order</FormLabel>
      <FormControl>
        <Input
          type="number"
          min={0}
          {...field}
          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### URL Input
```typescript
<FormField
  control={form.control}
  name="siteUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Website URL</FormLabel>
      <FormControl>
        <Input type="url" placeholder="https://example.com" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Form with Edit Mode

For edit forms, accept an `initialData` prop and set `defaultValues`:

```typescript
interface Edit{Entity}FormProps {
  {entity}: {Entity};
  onSubmit: (data: Update{Entity}Dto) => Promise<void>;
  isLoading?: boolean;
}

export function Edit{Entity}Form({ {entity}, onSubmit, isLoading }: Edit{Entity}FormProps) {
  const form = useForm<Update{Entity}FormData>({
    resolver: zodResolver(update{Entity}Schema),
    defaultValues: {
      name: {entity}.name,
      description: {entity}.description ?? "",
      status: {entity}.status,
    },
  });

  // ... rest of form
}
```

## Reference

- Pattern: `src/components/features/admin/studios/create-studio-form-dialog.tsx`
- shadcn Form: `src/components/ui/layout/form`
- Validators: `src/lib/validators/`
- Rule: `.cursor/rules/06-forms-validation.mdc`
