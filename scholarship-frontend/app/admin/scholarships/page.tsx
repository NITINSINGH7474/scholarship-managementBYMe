"use client";

import { useEffect, useState } from "react";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import api from "@/src/lib/api";
import { Scholarship } from "@/src/lib/scholarship.api";

export default function AdminScholarshipsPage() {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        provider: "",
        deadline: "",
        eligibility: "",
        educationLevel: "",
    });

    const fetchScholarships = async () => {
        try {
            const res = await api.get("/scholarships?limit=100");
            setScholarships(res.data.docs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarships();
    }, []);

    const handleEdit = (sch: Scholarship) => {
        setEditingId(sch._id);
        setFormData({
            title: sch.title,
            description: sch.description,
            amount: String(sch.amount),
            provider: sch.provider,
            deadline: sch.deadline ? new Date(sch.deadline).toISOString().split('T')[0] : "",
            eligibility: sch.criteria?.minIncome ? `Min Income: ${sch.criteria.minIncome}` : "", // Simplified for demo
            educationLevel: sch.educationLevel || "",
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            title: "",
            description: "",
            amount: "",
            provider: "",
            deadline: "",
            eligibility: "",
            educationLevel: "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this scholarship?")) return;
        try {
            await api.delete(`/scholarships/${id}`);
            fetchScholarships();
        } catch (err) {
            alert("Failed to delete scholarship");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            description: formData.description,
            amount: Number(formData.amount),
            provider: formData.provider,
            deadline: formData.deadline,
            educationLevel: formData.educationLevel,
            // criteria: ... handle complex object if needed
        };

        try {
            if (editingId) {
                await api.put(`/scholarships/${editingId}`, payload);
            } else {
                await api.post("/scholarships", payload);
            }
            setIsModalOpen(false);
            fetchScholarships();
        } catch (err) {
            alert("Failed to save scholarship");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Scholarships</h1>
                <Button onClick={handleCreate}>+ Create New</Button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {scholarships.map((sch) => (
                        <div key={sch._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white">{sch.title}</h3>
                                <p className="text-gray-400">{sch.provider} • ${sch.amount}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => handleEdit(sch)}>Edit</Button>
                                <button
                                    onClick={() => handleDelete(sch._id)}
                                    className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Scholarship" : "Create Scholarship"}
            >
                <form id="sch-form" onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        label="Provider"
                        value={formData.provider}
                        onChange={e => setFormData({ ...formData, provider: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount ($)"
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        <Input
                            label="Deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button type="submit">{editingId ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
