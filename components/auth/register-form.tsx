import { useState, ChangeEvent, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userRegisterSchema } from "@shared/schema";
import type { UserRegister } from "@shared/schema";

// Extend the shared UserRegister with fields used only in the client form
type ExtendedUserRegister = UserRegister & {
  phone?: string;
  profilePicture?: string;
  purchaseToken?: string; // optional - will be auto-filled from guest purchase if present
};

const RegisterForm = () => {
  const DRAFT_KEY = 'b2f_register_draft';
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<ExtendedUserRegister>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "", // Use empty string instead of null
      lastName: "", // Use empty string instead of null
      profilePicture: "", // Use empty string instead of null
      phone: "",
      dateOfBirth: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: ExtendedUserRegister) => {
      console.log("Register API call with data:", data);
      // Convert empty strings to undefined for optional fields
      const apiData = {
        ...data,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        profilePicture: data.profilePicture || undefined,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      };

      const response = await registerUser(apiData);
      console.log("Register API response status:", response.status);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Registration error response body:", errorData);
        // Include server-provided `detail` when available for easier debugging
        const detailMsg = errorData?.detail ? `: ${errorData.detail}` : "";
        throw new Error(
          (errorData.message || "Failed to register") + detailMsg
        );
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description:
          "Your account has been created. Please log in to continue.",
        variant: "default",
      });
      // Clear saved draft and purchase token after successful registration
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(DRAFT_KEY);
          localStorage.removeItem('b2f_purchase_token');
        }
      } catch (e) {
        console.warn('Failed to clear localStorage after registration', e);
      }
      // Do not invalidate the session here — the user must explicitly log in.
      // Navigate to the login page and replace history so back button doesn't return to register success state.
      navigate("/login", { replace: true });
    },
    onError: (error: Error) => {
      setServerError(error.message);
    },
  });

  const onSubmit = (data: ExtendedUserRegister) => {
    setServerError(null);
    console.log("Form submission data:", data);
    // Normalize inputs
    data.phone = data.phone?.toString().trim();

    // Grab a purchase token or transaction id from localStorage (set after guest purchase) if not provided
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('b2f_purchase_token') : null;
    const storedTxId = typeof window !== 'undefined' ? localStorage.getItem('b2f_transaction_id') : null;
    if (!data.purchaseToken && storedToken) {
      data.purchaseToken = storedToken;
    }
    // If no token but we have a transaction id, pass it as transactionId so server can match the purchase
    if (!data.purchaseToken && storedTxId) {
      // attach as a field the server understands for claim
      // the shared schema doesn't include transactionId in UserRegister, but registerUser will forward it
      (data as any).transactionId = storedTxId;
    }

    if (
      !data.email ||
      !data.username ||
      !data.password ||
      !data.confirmPassword
    ) {
      console.error("Missing required fields");
      setServerError("Please fill in all required fields");
      return;
    }

    // Require phone and profile picture
    // phone is also validated by zod - but keep a guard here
    if (!data.phone) {
      setServerError("Phone number is required");
      return;
    }
    // if (!data.profilePicture) {
    //   setServerError('Please upload a profile picture');
    //   return;
    // }

    if (data.password !== data.confirmPassword) {
      console.error("Passwords do not match");
      setServerError("Passwords do not match");
      return;
    }

    if (data.password.length < 8) {
      console.error("Password too short");
      setServerError("Password must be at least 8 characters");
      return;
    }

    // Check for validation errors
    if (Object.keys(form.formState.errors).length > 0) {
      console.error("Form validation errors:", form.formState.errors);
      return;
    }

    try {
      console.log("Submitting registration form...");
      registerMutation.mutate(data);
    } catch (error) {
      console.error("Error during form submission:", error);
      setServerError("An unexpected error occurred during registration.");
    }
  };

  // upload handler for profile picture
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;
    // preview locally using object URL while uploading
    const objectUrl = URL.createObjectURL(file);
    // revoke previous preview to avoid memory leak
    if (previewUrl && previewUrl.startsWith("blob:"))
      URL.revokeObjectURL(previewUrl);
    setPreviewUrl(objectUrl);

    // Upload directly from the frontend to Supabase Storage using the client-side anon key.
    // Note: this requires the bucket `profilepictures` to allow uploads for the current user (RLS) or be public.
    try {
      setUploading(true);

      const timestamp = Date.now();
      const filePath = `${timestamp}_${file.name}`;

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("profilepictures")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) {
        console.error("Supabase upload error", uploadErr);
        // Common root causes: bucket RLS blocking insert or missing permissions
        const status = (uploadErr as any).status;
        if (
          status === 403 ||
          (uploadErr as any).message?.toLowerCase().includes("row-level")
        ) {
          setUploadError(
            'Upload failed: unauthorized. Make the "profilepictures" bucket public or adjust Storage RLS to allow uploads for authenticated users.'
          );
        } else {
          setUploadError(
            "Failed to upload image: " + (uploadErr.message || "unknown error")
          );
        }
        return;
      }

      // Get public URL for the uploaded file
      const { data: publicData } = supabase.storage
        .from("profilepictures")
        .getPublicUrl(filePath);
      const publicUrl = publicData?.publicUrl ?? "";

      // revoke local object URL after we have remote URL
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPreviewUrl(publicUrl);
      // set form value
      form.setValue("profilePicture", publicUrl);
    } catch (err) {
      console.error("Unexpected upload error", err);
      setUploadError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Load saved draft on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure we only set fields that exist in the form
        form.reset({
          ...form.getValues(),
          ...(parsed || {}),
        });
      }
      // If there's a purchase token saved separately, ensure it's available in draft
      const token = localStorage.getItem('b2f_purchase_token');
      if (token) {
        // also store it in the draft so it persists with other fields
        const current = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
        if (current.purchaseToken !== token) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...current, purchaseToken: token }));
        }
      }
    } catch (e) {
      console.warn('Failed to load register draft from localStorage', e);
    }
  }, []);

  // Autosave form values to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const subscription = form.watch((value) => {
      try {
        const token = localStorage.getItem('b2f_purchase_token');
        const txid = localStorage.getItem('b2f_transaction_id');
        const toSave = { ...value, purchaseToken: token || value.purchaseToken, transactionId: txid || (value as any).transactionId };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.warn('Failed to save register draft', e);
      }
    });

    return () => subscription.unsubscribe && subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div>
      {serverError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {registerMutation.isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : "An error occurred during registration"}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      autoComplete="given-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      autoComplete="family-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe123"
                    {...field}
                    autoComplete="username"
                  />
                </FormControl>
                <FormDescription>
                  This will be your display name on the platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    type="email"
                    autoComplete="email"
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* purchaseToken is intentionally not shown in the form UI.
              The token (if any) is injected automatically from localStorage during submit.
          */}

          <FormItem>
            <FormLabel>Profile picture (Optional)</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-sm file:font-semibold file:text-white"
              />
            </FormControl>
            {uploading && (
              <div className="text-sm text-gray-400 mt-2">Uploading...</div>
            )}
            {uploadError && (
              <div className="text-sm text-destructive mt-2">{uploadError}</div>
            )}
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-20 w-20 rounded-full object-cover"
                />
              </div>
            )}
          </FormItem>
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input placeholder="YYYY-MM-DD" {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    maxLength={50}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    {...field}
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={registerMutation.isPending || uploading}
            onClick={() => {
              console.log("Button clicked, form state:", {
                isValid: form.formState.isValid,
                isDirty: form.formState.isDirty,
                errors: form.formState.errors,
                values: form.getValues(),
              });
              // The actual submission is handled by form.handleSubmit
            }}
          >
            {uploading
              ? "Uploading image..."
              : registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
