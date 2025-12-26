"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { login, logout } from "@/src/store/slices/auth.slice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/src/components/ui/AuthCard";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Captcha from "@/src/components/ui/Captcha";
import { Suspense, useEffect, useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error } = useAppSelector((s) => s.auth);

  const signupSuccess = searchParams.get("signupSuccess");

  const [role, setRole] = useState<"APPLICANT" | "ADMIN">("APPLICANT");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [localError, setLocalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLocalError("");

    if (!captchaValid) {
      setLocalError("Please complete the captcha.");
      return;
    }

    const res = await dispatch(login(data));

    if (login.fulfilled.match(res)) {
      const userRole = res.payload.user.role;

      // Strict Check: Did user select correct role?
      if (role === "ADMIN") {
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          setLocalError("Access Denied: This account is not an Admin.");
          await dispatch(logout());
        }
      } else {
        // Student Login Selected
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          setLocalError("This is an Admin account. Please switch to Admin login.");
          await dispatch(logout());
        } else {
          router.push("/dashboard");
        }
      }
    }
  };

  return (
    <AuthCard
      title={role === "ADMIN" ? "Admin Login" : "Student Login"}
      subtitle={
        <span className="flex gap-1 justify-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary-hover transition-colors">
            Sign up
          </Link>
        </span>
      }
    >
      {/* Role Toggle */}
      <div className="flex bg-white/5 p-1 rounded-lg mb-6 border border-white/10">
        <button
          type="button"
          onClick={() => setRole("APPLICANT")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === "APPLICANT"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-gray-400 hover:text-white"
            }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("ADMIN")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === "ADMIN"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
              : "text-gray-400 hover:text-white"
            }`}
        >
          Admin
        </button>
      </div>

      {signupSuccess && (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-200 text-sm p-3 rounded-lg text-center">
          Account created! Please verify your email or log in.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          placeholder={role === "ADMIN" ? "admin@example.com" : "student@example.com"}
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Captcha onVerify={setCaptchaValid} />

        {(error || localError) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg">
            {localError || error}
          </div>
        )}

        <Button type="submit" className={`w-full mt-4 ${role === 'ADMIN' ? 'bg-purple-600 hover:bg-purple-500' : ''}`} isLoading={loading}>
          Log In as {role === "ADMIN" ? "Admin" : "Student"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
