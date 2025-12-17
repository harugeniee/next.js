"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button, Input, Label } from "@/components/ui";
import {
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn-io/popover";
import { useAuthRedirect } from "@/hooks/auth";
import {
  accessTokenAtom,
  currentUserAtom,
  fetchMeAction,
  signupAction,
} from "@/lib/auth";
import { extractErrorMessage } from "@/lib/utils/error-extractor";
import {
  registerFormSchema,
  type RegisterFormData,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { ArrowLeft, ChevronDownIcon, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

/**
 * Date Picker Field Component
 * Wrapper component for date picker with popover state management
 */
function DatePickerField({
  id,
  value,
  onSelect,
  placeholder,
  ariaInvalid,
  disabled,
}: {
  id: string;
  value?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder: string;
  ariaInvalid?: boolean;
  disabled?: (date: Date) => boolean;
}) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onSelect(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className="w-full justify-between font-normal"
          type="button"
          aria-invalid={ariaInvalid}
        >
          {value ? value.toLocaleDateString() : placeholder}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Register Page Component
 * Handles user registration with form validation and edge cases
 * Uses custom i18n hook for multi-language support
 * Includes proper error handling and loading states
 */
export default function RegisterPage() {
  const { t } = useI18n();
  const { isAuthenticated, authLoading } = useAuthRedirect();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Attempt to signup with provided credentials
      const user = await signupAction(
        values.username,
        values.email,
        values.password,
        values.name,
        values.dob,
        values.phoneNumber,
      );

      // Update access token in Jotai state
      setAccessToken(null);

      // Fetch complete user data
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Show success message
      toast.success(
        t("authRegisterSuccess", "toast") || "Account created successfully!",
      );

      // Reset form
      reset();
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Redirect will be handled by useAuthRedirect hook
    } catch (error: unknown) {
      // Handle signup errors and show appropriate error message
      const errorMessage = extractErrorMessage(
        error,
        t("errors.registerDefault", "auth") || "Signup failed. Please try again.",
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth
    toast.info("Google signup functionality coming soon!");
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is already authenticated
  // The useAuthRedirect hook will handle the redirect
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("nav.backToHome", "auth") || "Back to home"}
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("register.cardTitle", "auth") ||
                t("register.title", "auth") ||
                "Create Account"}
            </CardTitle>
            <CardDescription>
              {t("register.cardDescription", "auth") ||
                "Enter your information below to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Username field */}
                <div className="grid gap-3">
                  <Label htmlFor="username">
                    {t("fields.username", "common") || "Username"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={
                      t("placeholders.username", "common") || "Enter your username"
                    }
                    required
                    aria-invalid={!!errors.username}
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div className="grid gap-3">
                  <Label htmlFor="email">
                    {t("fields.email", "common") || "Email"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      t("placeholders.email", "common") || "m@example.com"
                    }
                    required
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="grid gap-3">
                  <Label htmlFor="password">
                    {t("fields.password", "common") || "Password"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        t("placeholders.password", "common") ||
                        "Enter your password"
                      }
                      required
                      aria-invalid={!!errors.password}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword
                          ? t("password.hidePassword", "auth") || "Hide password"
                          : t("password.showPassword", "auth") || "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password field */}
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">
                    {t("fields.confirmPassword", "common") || "Confirm Password"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={
                        t("placeholders.confirmPassword", "common") ||
                        "Confirm your password"
                      }
                      required
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirmPassword
                          ? t("password.hidePassword", "auth") || "Hide password"
                          : t("password.showPassword", "auth") || "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Name field (optional) */}
                <div className="grid gap-3">
                  <Label htmlFor="name">
                    {t("fields.fullName", "common") || "Full Name"}
                    <span className="text-muted-foreground ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={
                      t("placeholders.fullName", "common") || "Enter your full name"
                    }
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth field (optional) */}
                <div className="grid gap-3">
                  <Label htmlFor="dob">
                    {t("fields.dob", "common") || "Date of Birth"}
                    <span className="text-muted-foreground ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => {
                      // Convert string (YYYY-MM-DD) to Date object
                      const dateValue = field.value
                        ? new Date(field.value)
                        : undefined;
                      
                      // Convert Date to YYYY-MM-DD string
                      const handleDateSelect = (date: Date | undefined) => {
                        if (!date) {
                          field.onChange("");
                          return;
                        }
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const day = String(date.getDate()).padStart(2, "0");
                        field.onChange(`${year}-${month}-${day}`);
                      };

                      return (
                        <DatePickerField
                          id="dob"
                          value={dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined}
                          onSelect={handleDateSelect}
                          placeholder={t("placeholders.dob", "common") || "Select date"}
                          ariaInvalid={!!errors.dob}
                          disabled={(date) => {
                            // Disable future dates for DOB
                            const today = new Date();
                            today.setHours(23, 59, 59, 999);
                            return date > today;
                          }}
                        />
                      );
                    }}
                  />
                  {errors.dob && (
                    <p className="text-sm text-red-500">{errors.dob.message}</p>
                  )}
                </div>

                {/* Phone Number field (optional) */}
                <div className="grid gap-3">
                  <Label htmlFor="phoneNumber">
                    {t("fields.phone", "common") || "Phone Number"}
                    <span className="text-muted-foreground ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder={
                      t("placeholders.phone", "common") ||
                      "Enter your phone number"
                    }
                    aria-invalid={!!errors.phoneNumber}
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Submit buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? t("register.submitting", "auth") || "Creating Account..."
                      : t("register.button", "auth") || "Create Account"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    {t("oauth.registerWith", "auth", { provider: t("oauth.google", "auth") }) || "Register with Google"}
                  </Button>
                </div>
              </div>

              {/* Footer text with link to login */}
              <div className="mt-4 text-center text-sm">
                {t("register.alreadyHaveAccount", "auth") || "Already have an account?"}{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {t("login.button", "auth") || "Login"}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
