"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import { Plus, Trash2 } from "lucide-react";

export interface ExternalLinksBuilderProps {
  links: Record<string, string>;
  onChange: (links: Record<string, string>) => void;
  className?: string;
  label?: string;
  addLinkLabel?: string;
  noLinksLabel?: string;
}

/**
 * External Links Builder Component
 * Allows adding/removing key-value pairs for external links
 */
export function ExternalLinksBuilder({
  links,
  onChange,
  className,
  label,
  addLinkLabel,
  noLinksLabel,
}: ExternalLinksBuilderProps) {
  const { t } = useI18n();

  const linkEntries = Object.entries(links);

  const handleAddLink = () => {
    onChange({
      ...links,
      "": "", // Add empty key-value pair
    });
  };

  const handleRemoveLink = (key: string) => {
    const newLinks = { ...links };
    delete newLinks[key];
    onChange(newLinks);
  };

  const handleUpdateLink = (oldKey: string, newKey: string, value: string) => {
    const newLinks = { ...links };
    delete newLinks[oldKey];
    if (newKey.trim() && value.trim()) {
      newLinks[newKey.trim()] = value.trim();
    }
    onChange(newLinks);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">
          {label || t("create.form.externalLinks", "series")}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddLink}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {addLinkLabel || t("create.form.addLink", "series")}
        </Button>
      </div>

      {linkEntries.length === 0 ? (
        <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
          {noLinksLabel || t("create.form.noExternalLinks", "series")}
        </div>
      ) : (
        <div className="space-y-3">
          {linkEntries.map(([key, value]) => (
            <div key={key} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder={t("create.form.linkLabel", "series")}
                  value={key}
                  onChange={(e) => handleUpdateLink(key, e.target.value, value)}
                  className="text-sm"
                />
                <Input
                  type="url"
                  placeholder={t("create.form.linkUrl", "series")}
                  value={value}
                  onChange={(e) => handleUpdateLink(key, key, e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveLink(key)}
                className="h-9 w-9 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
