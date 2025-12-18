// "use client";

// import { BreadcrumbNav } from "@/components/features/navigation";
// import { useI18n } from "@/components/providers/i18n-provider";
// import { Button, Input } from "@/components/ui";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/core";
// import { ImageUpload } from "@/components/ui/core/image-upload";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/layout/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useRequireAuth } from "@/hooks/auth";
// import { useCreateOrganization } from "@/hooks/organizations";
// import { useBreadcrumb } from "@/hooks/ui";
// import type { UploadedMedia } from "@/lib/api/media";
// import { http } from "@/lib/http";
// import type { ApiResponse } from "@/lib/types";
// import {
//   createOrganizationSchema,
//   type CreateOrganizationFormData,
// } from "@/lib/validators/organizations";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// /**
//  * Organization Registration Page Component
//  * Handles organization creation with form validation and edge cases
//  * Uses custom i18n hook for multi-language support
//  * Includes proper error handling and loading states
//  */
// export default function OrganizationRegisterPage() {
//   const { t } = useI18n();
//   const router = useRouter();
//   const { isAuthenticated, authLoading } = useRequireAuth();
//   const createOrganization = useCreateOrganization();
//   const breadcrumbItems = useBreadcrumb();

//   // Logo file state
//   const [logoFile, setLogoFile] = useState<File | null>(null);
//   const [logoUploadProgress, setLogoUploadProgress] = useState<number>(0);
//   const [logoUploadStatus, setLogoUploadStatus] = useState<
//     "idle" | "uploading" | "success" | "error"
//   >("idle");
//   const [uploadedLogoId, setUploadedLogoId] = useState<string | undefined>(
//     undefined,
//   );
//   const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | undefined>(
//     undefined,
//   );

//   const form = useForm<CreateOrganizationFormData>({
//     resolver: zodResolver(createOrganizationSchema),
//     defaultValues: {
//       name: "",
//       slug: "",
//       description: "",
//       websiteUrl: "",
//       logoUrl: "",
//       logoId: "",
//       visibility: "public",
//     },
//   });

//   const {
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = form;

//   // Upload logo with progress tracking
//   const uploadLogoWithProgress = async (file: File) => {
//     setLogoUploadStatus("uploading");
//     setLogoUploadProgress(0);

//     try {
//       const formData = new FormData();
//       formData.append("files", file);

//       const response = await http.post<ApiResponse<UploadedMedia[]>>(
//         "/media",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percentCompleted = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total,
//               );
//               setLogoUploadProgress(percentCompleted);
//             }
//           },
//         },
//       );

//       if (response.data.success && response.data.data.length > 0) {
//         const uploadedMedia = response.data.data[0];
//         setUploadedLogoId(uploadedMedia.id);
//         setUploadedLogoUrl(uploadedMedia.url);
//         setLogoUploadStatus("success");
//         setLogoUploadProgress(100);

//         return uploadedMedia;
//       } else {
//         throw new Error(response.data.message || "Upload failed");
//       }
//     } catch (error) {
//       console.error("Logo upload error:", error);
//       setLogoUploadStatus("error");
//       setLogoUploadProgress(0);
//       throw error;
//     }
//   };

//   // Handle logo file selection - just store the file, don't upload yet
//   const handleLogoFileChange = (file: File | null) => {
//     setLogoFile(file);

//     if (!file) {
//       // Reset upload state when file is removed
//       setLogoUploadStatus("idle");
//       setLogoUploadProgress(0);
//       setUploadedLogoId(undefined);
//       setUploadedLogoUrl(undefined);
//       form.setValue("logoId", "");
//       form.setValue("logoUrl", "");
//     } else {
//       // Reset upload status when new file is selected
//       setLogoUploadStatus("idle");
//       setLogoUploadProgress(0);
//       setUploadedLogoId(undefined);
//       setUploadedLogoUrl(undefined);
//     }
//   };

//   const onSubmit = async (values: CreateOrganizationFormData) => {
//     try {
//       let logoId: string | undefined =
//         uploadedLogoId || values.logoId?.trim() || undefined;

//       // Upload logo file if provided (only when submitting form)
//       if (logoFile && !uploadedLogoId) {
//         try {
//           const uploadedMedia = await uploadLogoWithProgress(logoFile);
//           if (uploadedMedia?.id) {
//             logoId = uploadedMedia.id;
//             // Also set logoUrl if available
//             if (uploadedMedia.url && !values.logoUrl?.trim()) {
//               form.setValue("logoUrl", uploadedMedia.url);
//             }
//           }
//         } catch (uploadError) {
//           console.error("Logo upload error:", uploadError);
//           toast.error(
//             t("register.logoUploadError", "organizations") ||
//               "Failed to upload logo. Please try again.",
//           );
//           return; // Stop submission if logo upload fails
//         }
//       }

//       // Prepare data for API (remove empty strings)
//       const data = {
//         name: values.name.trim(),
//         slug: values.slug?.trim() || undefined,
//         description: values.description?.trim() || undefined,
//         websiteUrl: values.websiteUrl?.trim() || undefined,
//         logoUrl: values.logoUrl?.trim() || undefined,
//         logoId: logoId,
//         visibility: values.visibility || "public",
//       };

//       // Create organization
//       const organization = await createOrganization.mutateAsync(data);

//       // Reset form and logo file
//       reset();
//       setLogoFile(null);
//       setLogoUploadStatus("idle");
//       setLogoUploadProgress(0);
//       setUploadedLogoId(undefined);
//       setUploadedLogoUrl(undefined);

//       // Redirect to organization detail page after a short delay to show success toast
//       // Use replace instead of push to avoid creating history entry
//       setTimeout(() => {
//         router.replace(`/organizations/${organization.id}`);
//       }, 500);
//     } catch (error: unknown) {
//       // Error is already handled by the mutation hook
//       console.error("Organization creation error:", error);
//     }
//   };

//   // Show loading state while auth is being checked
//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
//           <div className="flex items-center justify-center min-h-[60vh]">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Don't render the form if user is not authenticated
//   // The useRequireAuth hook will handle the redirect to login page
//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
//         {/* Breadcrumb Navigation */}
//         <div className="mb-4 sm:mb-6">
//           <BreadcrumbNav items={breadcrumbItems} />
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>
//               {t("register.cardTitle", "organizations") ||
//                 t("register.title", "organizations") ||
//                 "Create Organization"}
//             </CardTitle>
//             <CardDescription>
//               {t("register.cardDescription", "organizations") ||
//                 "Fill in the information below to create your organization"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="flex flex-col gap-4 sm:gap-6">
//                   {/* Organization Name field */}
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.name", "organizations") ||
//                             "Organization Name"}
//                           <span className="text-red-500 ml-1">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder={
//                               t("register.namePlaceholder", "organizations") ||
//                               "Enter organization name"
//                             }
//                             {...field}
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           {t("register.nameRequired", "organizations") ||
//                             "Organization name is required"}
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Slug field */}
//                   <FormField
//                     control={form.control}
//                     name="slug"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.slug", "organizations") || "Slug"}
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder={
//                               t("register.slugPlaceholder", "organizations") ||
//                               "organization-slug (optional, auto-generated if empty)"
//                             }
//                             {...field}
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           {t("register.slugDescription", "organizations") ||
//                             "URL-friendly identifier for your organization"}
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Description field */}
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.description", "organizations") ||
//                             "Description"}
//                           <span className="text-muted-foreground ml-1">
//                             {t(
//                               "register.descriptionOptional",
//                               "organizations",
//                             ) || "(optional)"}
//                           </span>
//                         </FormLabel>
//                         <FormControl>
//                           <textarea
//                             className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                             placeholder={
//                               t(
//                                 "register.descriptionPlaceholder",
//                                 "organizations",
//                               ) || "Tell us about your organization"
//                             }
//                             {...field}
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Website URL field */}
//                   <FormField
//                     control={form.control}
//                     name="websiteUrl"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.websiteUrl", "organizations") ||
//                             "Website URL"}
//                           <span className="text-muted-foreground ml-1">
//                             {t(
//                               "register.websiteUrlOptional",
//                               "organizations",
//                             ) || "(optional)"}
//                           </span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="url"
//                             placeholder={
//                               t(
//                                 "register.websiteUrlPlaceholder",
//                                 "organizations",
//                               ) || "https://example.com"
//                             }
//                             {...field}
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Logo Upload field */}
//                   <FormField
//                     control={form.control}
//                     name="logoId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.logo", "organizations") || "Logo"}
//                           <span className="text-muted-foreground ml-1">
//                             {t("register.logoOptional", "organizations") ||
//                               "(optional)"}
//                           </span>
//                         </FormLabel>
//                         <FormControl>
//                           <div className="space-y-3">
//                             <ImageUpload
//                               value={logoFile}
//                               onChange={handleLogoFileChange}
//                               placeholder={
//                                 t(
//                                   "register.logoPlaceholder",
//                                   "organizations",
//                                 ) || "Upload organization logo"
//                               }
//                               disabled={
//                                 isSubmitting ||
//                                 createOrganization.isPending ||
//                                 logoUploadStatus === "uploading"
//                               }
//                               maxSizeInMB={5}
//                               acceptedTypes={[
//                                 "image/jpeg",
//                                 "image/jpg",
//                                 "image/png",
//                                 "image/gif",
//                                 "image/webp",
//                               ]}
//                               enableCrop={true}
//                               aspectRatio={1} // Square logo
//                             />

//                             {/* Upload Progress Bar */}
//                             {logoUploadStatus === "uploading" && (
//                               <div className="space-y-2">
//                                 <div className="flex items-center justify-between text-xs">
//                                   <span className="text-muted-foreground">
//                                     {t(
//                                       "register.logoUploading",
//                                       "organizations",
//                                     ) || "Uploading logo..."}
//                                   </span>
//                                   <span className="font-medium text-foreground">
//                                     {logoUploadProgress}%
//                                   </span>
//                                 </div>
//                                 <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
//                                   <div
//                                     className="h-full bg-primary transition-all duration-300 ease-out"
//                                     style={{ width: `${logoUploadProgress}%` }}
//                                   />
//                                 </div>
//                               </div>
//                             )}

//                             {/* Upload Success Indicator */}
//                             {logoUploadStatus === "success" && (
//                               <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
//                                 <svg
//                                   className="h-4 w-4"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M5 13l4 4L19 7"
//                                   />
//                                 </svg>
//                                 <span>
//                                   {t(
//                                     "register.logoUploadSuccess",
//                                     "organizations",
//                                   ) || "Logo uploaded successfully"}
//                                 </span>
//                               </div>
//                             )}

//                             {/* Upload Error Indicator */}
//                             {logoUploadStatus === "error" && (
//                               <div className="flex items-center gap-2 text-sm text-destructive">
//                                 <svg
//                                   className="h-4 w-4"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M6 18L18 6M6 6l12 12"
//                                   />
//                                 </svg>
//                                 <span>
//                                   {t(
//                                     "register.logoUploadError",
//                                     "organizations",
//                                   ) || "Failed to upload logo"}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         </FormControl>
//                         <FormDescription>
//                           {t("register.logoDescription", "organizations") ||
//                             "Upload a square logo for your organization. Recommended size: 512x512px"}
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Logo URL field (alternative to upload) */}
//                   <FormField
//                     control={form.control}
//                     name="logoUrl"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.logoUrl", "organizations") || "Logo URL"}
//                           <span className="text-muted-foreground ml-1">
//                             {t("register.logoUrlOptional", "organizations") ||
//                               "(optional)"}
//                           </span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="url"
//                             placeholder={
//                               t(
//                                 "register.logoUrlPlaceholder",
//                                 "organizations",
//                               ) ||
//                               "https://example.com/logo.png (alternative to upload)"
//                             }
//                             {...field}
//                             value={field.value || ""}
//                             disabled={
//                               !!logoFile || logoUploadStatus === "uploading"
//                             } // Disable if logo file is uploaded or uploading
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           {t("register.logoUrlDescription", "organizations") ||
//                             "Or provide a logo URL instead of uploading"}
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Visibility field */}
//                   <FormField
//                     control={form.control}
//                     name="visibility"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {t("register.visibility", "organizations") ||
//                             "Visibility"}
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue
//                                 placeholder={
//                                   t(
//                                     "register.visibilityDescription",
//                                     "organizations",
//                                   ) || "Control who can view your organization"
//                                 }
//                               />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="public">
//                               {t(
//                                 "register.visibilityPublic",
//                                 "organizations",
//                               ) || "Public"}
//                             </SelectItem>
//                             <SelectItem value="private">
//                               {t(
//                                 "register.visibilityPrivate",
//                                 "organizations",
//                               ) || "Private"}
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormDescription>
//                           {t(
//                             "register.visibilityDescription",
//                             "organizations",
//                           ) ||
//                             "Control who can view your organization. Public: Anyone can view and discover your organization. Private: Only members can view your organization."}
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Submit buttons */}
//                   <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full sm:w-auto"
//                       onClick={() => router.back()}
//                       disabled={
//                         isSubmitting ||
//                         createOrganization.isPending ||
//                         logoUploadStatus === "uploading"
//                       }
//                     >
//                       {t("register.cancelButton", "organizations") || "Cancel"}
//                     </Button>
//                     <Button
//                       type="submit"
//                       className="w-full sm:w-auto"
//                       disabled={
//                         isSubmitting ||
//                         createOrganization.isPending ||
//                         logoUploadStatus === "uploading"
//                       }
//                     >
//                       {isSubmitting ||
//                       createOrganization.isPending ||
//                       logoUploadStatus === "uploading"
//                         ? t("register.creating", "organizations") ||
//                           "Creating..."
//                         : t("register.createButton", "organizations") ||
//                           "Create Organization"}
//                     </Button>
//                   </div>
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
