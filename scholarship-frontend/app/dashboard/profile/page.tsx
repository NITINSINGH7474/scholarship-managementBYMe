"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useAppDispatch } from "@/src/store/hooks";
import { updateUser } from "@/src/store/slices/auth.slice";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        dob: "",
        address: {
            line1: "",
            city: "",
            state: "",
            postalCode: ""
        },
        education: {
            institution: "",
            degree: "",
            startYear: "",
        },
        family: {
            annualIncome: ""
        },
        avatar: ""
    });

    useEffect(() => {
        api.get("/profile/me")
            .then((res) => {
                if (res.data.profile) {
                    const p = res.data.profile;
                    setFormData({
                        fullName: p.extra?.fullName || "",
                        phone: p.extra?.phone || "",
                        dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : "",
                        address: {
                            line1: p.address?.line1 || "",
                            city: p.address?.city || "",
                            state: p.address?.state || "",
                            postalCode: p.address?.postalCode || ""
                        },
                        education: {
                            institution: p.education?.[0]?.institution || "",
                            degree: p.education?.[0]?.degree || "",
                            startYear: p.education?.[0]?.startYear || "",
                        },
                        family: {
                            annualIncome: p.family?.annualIncome || ""
                        },
                        avatar: res.data.user?.avatar || ""
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        if (section === "root") {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...((prev as any)[section]),
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                dob: formData.dob,
                address: formData.address,
                education: [formData.education], // Simplified to one entry
                family: formData.family,
                extra: {
                    fullName: formData.fullName,
                    phone: formData.phone
                }
            };
            await api.post("/profile", payload);
            if (formData.fullName) {
                dispatch(updateUser({ name: formData.fullName }));
            }
            alert("Profile saved successfully!");
        } catch (err) {
            alert("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-gray-400">Manage your personal information for scholarship applications.</p>
            </div>

            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="relative group cursor-pointer w-24 h-24">
                    <img
                        src={formData.avatar ? (`http://localhost:5000${formData.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || "User")}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 group-hover:border-indigo-500 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <span className="text-xs text-white">Change</span>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                const file = e.target.files[0];
                                const fd = new FormData();
                                fd.append("avatar", file);

                                try {
                                    const res = await api.post("/users/avatar", fd);
                                    if (res.data.success) {
                                        setFormData(prev => ({ ...prev, avatar: res.data.avatar }));
                                        dispatch(updateUser({ avatar: res.data.avatar }));
                                        alert("Avatar updated!");
                                    }
                                } catch (err) {
                                    alert("Failed to upload avatar");
                                }
                            }
                        }}
                    />
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">Click image to upload new photo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white">Personal Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            value={formData.fullName}
                            onChange={e => handleChange("root", "fullName", e.target.value)}
                            required
                        />
                        <Input
                            label="Phone Number"
                            value={formData.phone}
                            onChange={e => handleChange("root", "phone", e.target.value)}
                        />
                        <Input
                            label="Date of Birth"
                            type="date"
                            value={formData.dob}
                            onChange={e => handleChange("root", "dob", e.target.value)}
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white">Address</h3>
                    <Input
                        label="Street Address"
                        value={formData.address.line1}
                        onChange={e => handleChange("address", "line1", e.target.value)}
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input
                            label="City"
                            value={formData.address.city}
                            onChange={e => handleChange("address", "city", e.target.value)}
                        />
                        <Input
                            label="State"
                            value={formData.address.state}
                            onChange={e => handleChange("address", "state", e.target.value)}
                        />
                        <Input
                            label="Postal Code"
                            value={formData.address.postalCode}
                            onChange={e => handleChange("address", "postalCode", e.target.value)}
                        />
                    </div>
                </div>

                {/* Education & Financial */}
                <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white">Education & Income</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Current Institution"
                            value={formData.education.institution}
                            onChange={e => handleChange("education", "institution", e.target.value)}
                        />
                        <Input
                            label="Degree / Class"
                            value={formData.education.degree}
                            onChange={e => handleChange("education", "degree", e.target.value)}
                        />
                        <Input
                            label="Start Year"
                            type="number"
                            value={formData.education.startYear}
                            onChange={e => handleChange("education", "startYear", e.target.value)}
                        />
                        <Input
                            label="Annual Family Income"
                            type="number"
                            value={formData.family.annualIncome}
                            onChange={e => handleChange("family", "annualIncome", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" isLoading={saving}>
                        Save Profile
                    </Button>
                </div>
            </form>
        </div >
    );
}
