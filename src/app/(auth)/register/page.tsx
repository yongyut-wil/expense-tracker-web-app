"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "@/lib/validations/auth";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiResponse } from "@/types";
import { Wallet, User, Mail, Lock, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    // 1. กำหนดเกณฑ์การตรวจสอบ (Criteria) เป็นรายการเงื่อนไข Boolean
    const criteria = [
      password.length >= 8,           // ความยาวอย่างน้อย 8 ตัวอักษร
      /[A-Z]/.test(password),        // มีตัวอักษรพิมพ์ใหญ่ (A-Z)
      /[a-z]/.test(password),        // มีตัวอักษรพิมพ์เล็ก (a-z)
      /[0-9]/.test(password),        // มีตัวเลข (0-9)
      /[^A-Za-z0-9]/.test(password), // มีอักขระพิเศษ (เช่น !@#$%^&*)
    ];

    // 2. กรองเอาเฉพาะเงื่อนไขที่ผ่าน (true) และนับจำนวนเพื่อเป็นคะแนนความแข็งแกร่ง (0-5)
    // การใช้ filter(Boolean) ช่วยให้โค้ดกระชับและอ่านง่ายกว่าการใช้ if-else หลายตัว
    const score = criteria.filter(Boolean).length;

    // 3. อัปเดตสถานะความแข็งแกร่งเพื่อนำไปแสดงผลสีและข้อความแจ้งเตือนใน UI
    setPasswordStrength(score);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-lime-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "คาดเดาง่ายมาก";
    if (passwordStrength <= 2) return "คาดเดาง่าย";
    if (passwordStrength <= 3) return "ปานกลาง";
    if (passwordStrength <= 4) return "รัดกุม";
    return "รัดกุมมาก";
  };

  async function onSubmit(data: RegisterInput) {
    try {
      const response = await api.post<ApiResponse<null>>("/auth/register", {
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (response.data.success) {
        toast.success("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
        router.push("/login");
      } else {
        toast.error(response.data.error?.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
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
            สร้างบัญชีใหม่
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            เริ่มต้นจัดการการเงินของคุณวันนี้
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">ชื่อ</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                          placeholder="Your Name" 
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
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            checkPasswordStrength(e.target.value);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-500 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {/* Password strength indicator */}
                    {field.value && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                level <= passwordStrength ? getStrengthColor() : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${passwordStrength >= 4 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                          ความคาดเดาง่าย: {getStrengthText()}
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">ยืนยันรหัสผ่าน</FormLabel>
                    <FormControl>
                       <div className="relative group">
                        <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-500 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <label className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground hover:text-gray-700 transition-colors py-1">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" required />
                <span>ฉันยอมรับ <Link href="#" className="text-indigo-600 hover:underline">ข้อตกลงและเงื่อนไข</Link></span>
              </label>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    กำลังสมัคร...
                  </span>
                ) : (
                  "สมัครสมาชิก"
                )}
              </Button>
            </form>
          </Form>
           <div className="text-center text-sm">
             <span className="text-muted-foreground">มีบัญชีแล้ว? </span>
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              เข้าสู่ระบบ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
