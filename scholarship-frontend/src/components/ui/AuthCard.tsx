import React from "react";

export default function AuthCard({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            {title}
                        </h1>
                        {subtitle && <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
