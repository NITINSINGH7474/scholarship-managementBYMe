"use client";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { signup } from "@/src/store/slices/auth.slice";
import { useForm } from "react-hook-form";
import Link from "next/link";
import AuthCard from "@/src/components/ui/AuthCard";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const [role, setRole] = useState<"APPLICANT" | "ADMIN">("APPLICANT");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: SignupForm) => {
    const res = await dispatch(signup({ ...data, role }));
    if (signup.fulfilled.match(res)) {
      router.push("/login?signupSuccess=true");
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle={
        <span className="flex gap-1 justify-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
            Log in
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder={role === "ADMIN" ? "Admin Name" : "Student Name"}
          error={errors.name ? "Name is required" : undefined}
          {...register("name", { required: true })}
        />

        <Input
          label="Email Address"
          placeholder="email@example.com"
          type="email"
          error={errors.email ? "Email is required" : undefined}
          {...register("email", { required: true })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password ? "Min 6 characters" : undefined}
          {...register("password", { required: true, minLength: 6 })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword ? "Passwords do not match" : undefined}
          {...register("confirmPassword", {
            required: true,
            validate: (val, formValues) => val === formValues.password
          })}
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" className={`w-full mt-4 ${role === 'ADMIN' ? 'bg-purple-600 hover:bg-purple-500' : ''}`} isLoading={loading}>
          Sign Up as {role === "ADMIN" ? "Admin" : "Student"}
        </Button>
      </form>
    </AuthCard>
  );
}
