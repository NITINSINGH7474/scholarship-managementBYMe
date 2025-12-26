"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { login, logout } from "@/src/store/slices/auth.slice";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";

export default function AdminLoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [localError, setLocalError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        const res = await dispatch(login(formData));
        if (login.fulfilled.match(res)) {
            if (res.payload.user.role === "ADMIN" || res.payload.user.role === "SUPER_ADMIN") {
                router.push("/admin");
            } else {
                setLocalError("Access Denied: You do not have admin privileges.");
                await dispatch(logout()); // Logout if they managed to log in as user
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-400 text-sm">Authorized personnel only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {(error || localError) && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {localError || error}
                        </div>
                    )}

                    <Input
                        label="Admin Email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-black/40"
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-black/40"
                    />

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" isLoading={loading}>
                        Access Portal
                    </Button>

                    <div className="text-center pt-4 border-t border-white/5">
                        <a href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                            Student Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
