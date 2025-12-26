"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/src/components/ui/AuthCard";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import api from "@/src/lib/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/auth/reset-password", { token, password });
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-400">
                <p>Invalid link. Please request a new password reset.</p>
                <Link href="/forgot-password" className="text-indigo-400 mt-4 inline-block">
                    Go back
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm">
                    {error}
                </div>
            )}

            <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
            />

            <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
                Reset Password
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <AuthCard title="Set New Password" subtitle="Choose a strong password for your account">
                <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </AuthCard>
        </div>
    );
}
