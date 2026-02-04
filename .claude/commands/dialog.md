# Create Dialog Component

Create a dialog component with form for create/edit operations.

## Arguments
- `$ARGUMENTS`: Dialog type and entity (e.g., "Create Publisher" or "Edit Publisher")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Type}` - "Create" or "Edit"
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{entity}` - camelCase (e.g., "publisher")
- `{entities}` - plural camelCase (e.g., "publishers")

### 1. Create Dialog Component

File: `src/components/features/{domain}/{type}-{entity}-form-dialog.tsx`

#### For Create Dialog:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import {
  Form,
  FormControl,
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

interface Create{Entity}FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Create{Entity}Dto) => Promise<void>;
  isLoading?: boolean;
}

export function Create{Entity}FormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: Create{Entity}FormDialogProps) {
  const { t } = useI18n();

  const form = useForm<Create{Entity}FormData>({
    resolver: zodResolver(create{Entity}Schema),
    defaultValues: {
      name: "",
      status: {ENTITY}_CONSTANTS.STATUS.ACTIVE,
    },
  });

  const handleSubmit = async (data: Create{Entity}FormData) => {
    const submitData: Create{Entity}Dto = {
      name: data.name,
      status: data.status,
    };
    await onSubmit(submitData);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("{entities}.form.createTitle", "admin")}</DialogTitle>
          <DialogDescription>
            {t("{entities}.form.createDescription", "admin")}
          </DialogDescription>
        </DialogHeader>
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
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
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
                      <SelectItem value={{ENTITY}_CONSTANTS.STATUS.ACTIVE}>
                        {t("{entities}.status.active", "admin")}
                      </SelectItem>
                      <SelectItem value={{ENTITY}_CONSTANTS.STATUS.INACTIVE}>
                        {t("{entities}.status.inactive", "admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("common.cancel", "common")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("actions.saving", "common") : t("{entities}.form.save", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

#### For Edit Dialog:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import {
  Form,
  FormControl,
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
import { update{Entity}Schema, type Update{Entity}FormData } from "@/lib/validators/{entity}";
import type { {Entity}, Update{Entity}Dto } from "@/lib/interface/{entity}.interface";

interface Edit{Entity}FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  {entity}: {Entity} | null;
  onSubmit: (id: string, data: Update{Entity}Dto) => Promise<void>;
  isLoading?: boolean;
}

export function Edit{Entity}FormDialog({
  open,
  onOpenChange,
  {entity},
  onSubmit,
  isLoading,
}: Edit{Entity}FormDialogProps) {
  const { t } = useI18n();

  const form = useForm<Update{Entity}FormData>({
    resolver: zodResolver(update{Entity}Schema),
    defaultValues: {
      name: "",
      status: {ENTITY}_CONSTANTS.STATUS.ACTIVE,
    },
  });

  // Reset form when {entity} changes
  useEffect(() => {
    if ({entity}) {
      form.reset({
        name: {entity}.name,
        status: {entity}.status ?? {ENTITY}_CONSTANTS.STATUS.ACTIVE,
      });
    }
  }, [{entity}, form]);

  const handleSubmit = async (data: Update{Entity}FormData) => {
    if (!{entity}) return;

    const submitData: Update{Entity}Dto = {
      name: data.name,
      status: data.status,
    };
    await onSubmit({entity}.id, submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("{entities}.form.editTitle", "admin")}</DialogTitle>
          <DialogDescription>
            {t("{entities}.form.editDescription", "admin")}
          </DialogDescription>
        </DialogHeader>
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
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
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
                      <SelectItem value={{ENTITY}_CONSTANTS.STATUS.ACTIVE}>
                        {t("{entities}.status.active", "admin")}
                      </SelectItem>
                      <SelectItem value={{ENTITY}_CONSTANTS.STATUS.INACTIVE}>
                        {t("{entities}.status.inactive", "admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("common.cancel", "common")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("actions.saving", "common") : t("{entities}.form.save", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Sheet Variant

For larger forms, use Sheet instead of Dialog:

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent className="sm:max-w-[540px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Form content */}
    </div>
    <SheetFooter>
      {/* Footer buttons */}
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Dialog Sizes

```typescript
// Small dialog
<DialogContent className="sm:max-w-[425px]">

// Medium dialog (default)
<DialogContent className="sm:max-w-[500px]">

// Large dialog
<DialogContent className="sm:max-w-[700px]">

// Extra large dialog
<DialogContent className="sm:max-w-[900px]">
```

## Reference

- Pattern: `src/components/features/admin/studios/create-studio-form-dialog.tsx`
- Pattern: `src/components/features/admin/studios/edit-studio-form-dialog.tsx`
- shadcn Dialog: `src/components/ui/layout/dialog`
- Rule: `.cursor/rules/06-forms-validation.mdc`
