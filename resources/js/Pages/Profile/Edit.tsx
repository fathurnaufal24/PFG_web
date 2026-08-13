import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { FormEventHandler, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { User, Mail, Key, Calendar, MapPin, CreditCard, Briefcase } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;

    type FormDataProps = {
        first_name?: string;
        last_name?: string;
        pob?: string;
        dob?: string;
        domicile?: string;
        card_number?: string;
        name?: string;
        email: string;
        current_password: string;
        password: string;
        password_confirmation: string;
    };

    let initialData: FormDataProps;

    if (user.role === 'teacher') {
        initialData = {
            first_name: user.teacher.first_name,
            last_name: user.teacher.last_name ?? '',
            pob: user.teacher.pob ?? '',
            dob: user.teacher.dob ?? '',
            domicile: user.teacher.domicile ?? '',
            card_number: user.teacher.card_number ?? '',
            name: '',
            email: user.email,
            current_password: '',
            password: '',
            password_confirmation: '',
        };
    } else if (user.role === 'admin') {
        initialData = {
            first_name: '',
            last_name: '',
            pob: '',
            dob: '',
            domicile: '',
            card_number: '',
            name: user.curriculum?.name ?? user.name ?? '',
            email: user.email,
            current_password: '',
            password: '',
            password_confirmation: '',
        };
    } else {
        // student
        initialData = {
            first_name: '',
            last_name: '',
            pob: '',
            dob: '',
            domicile: '',
            card_number: '',
            name: user.student?.name ?? user.name ?? '',
            email: user.email,
            current_password: '',
            password: '',
            password_confirmation: '',
        };
    }

    const { data, setData, put, patch, processing, errors, recentlySuccessful } = useForm(initialData);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'));
    };

    // Ambil inisial untuk avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const userFullName = user.role === 'teacher'
        ? `${user.teacher.first_name} ${user.teacher.last_name || ''}`.trim()
        : user.name;

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />
            <div className="flex-1 w-full p-6 md:p-8 bg-[#F3F4F9]">
                <div className="w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-emerald-600 font-medium">
                                Saved successfully! ✅
                            </p>
                        </Transition>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                                    {userFullName ? getInitials(userFullName) : 'U'}
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">{userFullName}</h3>
                                <p className="text-sm text-gray-500 capitalize">{user.role}</p>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-400">
                                        <Mail size={14} className="inline mr-2" />
                                        {user.email}
                                    </p>
                                </div>

                                {/* Badge Role */}
                                <div className="mt-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : ''}
                                        ${user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${user.role === 'student' ? 'bg-green-100 text-green-700' : ''}
                                    `}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Information */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <User size={20} className="text-emerald-500" />
                                    Profile Information
                                </h3>

                                <form onSubmit={submit} id="profile_form" className="space-y-4">
                                    {user.role === 'teacher' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="first_name" value="First Name" />
                                                <TextInput
                                                    id="first_name"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    className="mt-1 w-full"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="last_name" value="Last Name" />
                                                <TextInput
                                                    id="last_name"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                    className="mt-1 w-full"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <InputLabel htmlFor="name" value="Full Name" />
                                            <TextInput
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 w-full"
                                            />
                                        </div>
                                    )}

                                    {/* Teacher specific fields */}
                                    {user.role === 'teacher' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel htmlFor="pob" value="Place of Birth" />
                                                    <TextInput
                                                        id="pob"
                                                        value={data.pob}
                                                        onChange={(e) => setData('pob', e.target.value)}
                                                        className="mt-1 w-full"
                                                        placeholder="e.g., Jakarta"
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="dob" value="Date of Birth" />
                                                    <TextInput
                                                        id="dob"
                                                        type="date"
                                                        value={data.dob}
                                                        onChange={(e) => setData('dob', e.target.value)}
                                                        className="mt-1 w-full"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel htmlFor="domicile" value="Domicile" />
                                                    <TextInput
                                                        id="domicile"
                                                        value={data.domicile}
                                                        onChange={(e) => setData('domicile', e.target.value)}
                                                        className="mt-1 w-full"
                                                        placeholder="e.g., Bandung"
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="card_number" value="Card Number" />
                                                    <TextInput
                                                        id="card_number"
                                                        value={data.card_number}
                                                        onChange={(e) => setData('card_number', e.target.value)}
                                                        className="mt-1 w-full"
                                                        placeholder="Enter card number"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <InputLabel htmlFor="email" value="Email Address" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 w-full"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <PrimaryButton type="submit" form="profile_form" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>

                            {/* Change Password */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Key size={20} className="text-emerald-500" />
                                    Change Password
                                </h3>

                                <form onSubmit={updatePassword} id="update_password_form" className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="current_password" value="Current Password" />
                                        <TextInput
                                            type="password"
                                            id="current_password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="mt-1 w-full"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="password" value="New Password" />
                                            <TextInput
                                                type="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="mt-1 w-full"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                                            <TextInput
                                                type="password"
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="mt-1 w-full"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <PrimaryButton type="submit" form="update_password_form" disabled={processing}>
                                            {processing ? 'Updating...' : 'Change Password'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>

                            {/* Delete Account - Optional */}
                            {/* <div className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
                                <h3 className="text-lg font-bold text-red-600 mb-2">Delete Account</h3>
                                <p className="text-sm text-gray-500 mb-4">Once your account is deleted, all of its resources and data will be permanently deleted.</p>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition">
                                    Delete Account
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
