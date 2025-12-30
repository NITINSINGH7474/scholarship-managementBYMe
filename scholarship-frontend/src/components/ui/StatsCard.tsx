import React from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
                </div>
                {icon && (
                    <div className="p-3 bg-white/5 rounded-lg text-xl border border-white/10">
                        {icon}
                    </div>
                )}
            </div>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
    );
}
