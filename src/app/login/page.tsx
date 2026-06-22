"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/validators/login-validator";
import { AuthStorageService } from "@/services/auth-storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarCheck, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (AuthStorageService.isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const success = await AuthStorageService.login(data.username, data.password);

    if (success) {
      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    } else {
      toast.error("Invalid username or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-transparent">
      {/* Left Side - Corporate Branding (Hidden on mobile) */}
      <div className="hidden w-1/2 lg:flex flex-col justify-between bg-primary relative overflow-hidden p-12">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-accent opacity-20 blur-3xl mix-blend-screen" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-teal-300 opacity-20 blur-3xl mix-blend-overlay" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <span className="text-title text-2xl text-white">Leave MS</span>
          </div>

          <div className="space-y-6 max-w-lg mt-24">
            <h1 className="text-display text-5xl text-white leading-tight">
              Enterprise Grade <br/>
              <span className="text-accent">Leave Management</span>
            </h1>
            <p className="text-body-lg text-lg text-slate-200">
              A secure, reliable, and integrated platform to manage your corporate workforce efficiency seamlessly.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-300 font-medium">
          <ShieldCheck className="h-5 w-5 text-accent" />
          Protected by Enterprise Security Standards
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <span className="text-title text-2xl text-slate-800 dark:text-slate-100">Leave MS</span>
          </div>

          <div>
            <h2 className="text-display text-3xl text-slate-900 dark:text-slate-100">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Please sign in to access the corporate portal.
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 text-xs rounded-lg border border-blue-100 dark:border-blue-900">
              <p className="text-label text-blue-700 dark:text-blue-300 mb-2">Demo Accounts</p>
              <ul className="space-y-1.5 font-medium">
                <li className="flex items-center gap-2">Manager: <code className="text-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">admin</code> / <code className="text-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">admin123</code></li>
                <li className="flex items-center gap-2">Supervisor: <code className="text-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">hikari</code> / <code className="text-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">hikari123</code></li>
                <li className="flex items-center gap-2">Employee: <code className="text-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">haikal</code> / <code className="text-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">haikal123</code></li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-headline text-sm text-slate-700 dark:text-slate-300">Corporate ID / Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin"
                          autoComplete="username"
                          className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                          {...field}
                        />
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-headline text-sm text-slate-700 dark:text-slate-300">Password</FormLabel>
                        <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-md transition-all rounded-xl mt-4 text-headline tracking-normal"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Secure Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            By logging in, you agree to our <a href="#" className="underline hover:text-slate-800 dark:hover:text-slate-200">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800 dark:hover:text-slate-200">Privacy Policy</a>.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Want to view the latest code review report?</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/code-review")}
              className="rounded-xl shadow-sm text-primary border-primary/20 hover:bg-primary/5"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              View Public Code Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
