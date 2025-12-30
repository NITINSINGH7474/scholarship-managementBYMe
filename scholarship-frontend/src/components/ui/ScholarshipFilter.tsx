import React from "react";
import Button from "./Button";
import Input from "./Input";

export default function ScholarshipFilter() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    Filters
                </h3>
                <button className="text-sm text-red-500 hover:underline">Clear</button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Search</label>
                    <input
                        type="text"
                        placeholder="Keywords..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                    />
                </div>

                {/* Min Amount */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Min Amount ($)</label>
                    <input
                        type="number"
                        placeholder="e.g. 1000"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                    />
                </div>

                {/* Sort */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Sort By</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 bg-white">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                        <option>Highest Amount</option>
                    </select>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}
