"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/validations/auth";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiResponse, AuthResponse } from "@/types";
import { Wallet, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
      
      if (response.data.success && response.data.data) {
        const { access_token, user } = response.data.data;
        login(access_token, user); 
        toast.success("เข้าสู่ระบบสำเร็จ");
        router.push("/");
      } else {
        toast.error(response.data.error?.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-violet-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-200/40 via-transparent to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/10 blur-3xl" />

      <Card className="relative w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/80 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ExpenseTracker
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your expenses easily
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">อีเมล</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                          placeholder="user@example.com" 
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all" 
                          {...field} 
                        />
                      </div>
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
                    <FormLabel className="text-gray-700">รหัสผ่าน</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-gray-700 transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  Remember me
                </label>
                <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Forgot password?</Link>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-3 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">ยังไม่มีบัญชี? </span>
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              สมัครสมาชิก
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
