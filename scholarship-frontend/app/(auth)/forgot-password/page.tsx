"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/src/components/ui/AuthCard";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import api from "@/src/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setStatus(null);

        try {
            await api.post("/auth/request-reset", { email });
            setStatus({
                type: "success",
                message: "If an account exists, we've sent a password reset link."
            });
        } catch (err: any) {
            setStatus({
                type: "error",
                message: err.response?.data?.message || "Failed to send reset link."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <AuthCard title="Reset Password" subtitle="Enter your email to receive instructions">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status && (
                        <div className={`p-3 rounded-lg text-sm ${status.type === "success"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Send Reset Link
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                        Remember your password?{" "}
                        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
                            Log in
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </div>
    );
}
