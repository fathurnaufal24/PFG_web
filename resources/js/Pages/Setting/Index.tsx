import React, { useState } from 'react';
import { CheckCircle, Users } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';

interface ClassTypeSetting {
    type: string;
    max_student: number;
}

interface Props {
    classTypes: ClassTypeSetting[];
}

const typeDescriptions: Record<string, string> = {
    trial: 'Trial class for prospective students',
    regular: 'Regular group class',
    private: 'One-on-one or private class',
};

const SettingIndex = ({ classTypes }: Props) => {
    const pageProps = usePage().props as any;
    const flash = pageProps.flash;
    const [values, setValues] = useState<Record<string, string>>(
        Object.fromEntries(classTypes.map((c) => [c.type, String(c.max_student)]))
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.put(
            '/settings/class-types',
            {
                settings: classTypes.map((c) => ({
                    type: c.type,
                    max_student: parseInt(values[c.type]) || 0,
                })),
            },
            { preserveScroll: true, onFinish: () => setIsSaving(false) }
        );
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Settings</h1>
                <p className="text-sm text-slate-500 mb-6">Manage system-wide configuration.</p>

                {flash?.success && (
                    <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
                        <CheckCircle size={18} />
                        <span className="text-sm font-semibold">{flash.success}</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="bg-white border rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={18} className="text-emerald-600" />
                        <h2 className="font-bold text-slate-800">Max students per class type</h2>
                    </div>
                    <p className="text-xs text-slate-400 mb-5">
                        Applied automatically to new classes and class offerings. Existing classes are not changed.
                    </p>

                    <div className="space-y-4">
                        {classTypes.map((c) => (
                            <div key={c.type} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-slate-700 capitalize">{c.type}</p>
                                    <p className="text-xs text-slate-400">{typeDescriptions[c.type]}</p>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    required
                                    value={values[c.type]}
                                    onChange={(e) => setValues({ ...values, [c.type]: e.target.value })}
                                    className="w-24 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default SettingIndex;
