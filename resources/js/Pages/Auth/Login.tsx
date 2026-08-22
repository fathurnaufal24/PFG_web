import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import bgImage from './background-halaman-login.jpg';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Head title="Masuk Ke Akun Belajar Anda" />

            <div 
                className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center font-sans relative"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Overlay gelap */}
                <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

                <div className="w-full max-w-md z-10 relative">
                    {/* Main Login Card */}
                    <div className="bg-[#1E4A7A] w-full p-8 rounded-2xl shadow-2xl">
                        {/* Logo */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#D4B982]/20 rounded-xl flex items-center justify-center">
                                <BookOpen className="text-[#D4B982]" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-white">PFG Portal</span>
                        </div>

                        <h2 className="text-white text-xl font-semibold text-center mb-8 tracking-wide">
                            Yuk Masuk Ke Akun Belajar Anda
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Input */}
                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Nomor HP atau Email"
                                    className="w-full p-4 rounded-xl border-none outline-none bg-white text-gray-700 placeholder-gray-400 shadow-inner focus:ring-2 focus:ring-[#D4B982] transition"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-300 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kata Sandi"
                                    className="w-full p-4 pr-12 rounded-xl border-none outline-none bg-white text-gray-700 placeholder-gray-400 shadow-inner focus:ring-2 focus:ring-[#D4B982] transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#D4B982] focus:ring-[#D4B982] focus:ring-offset-0"
                                    />
                                    <span>Ingat saya</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-gray-300 hover:text-white transition hover:underline"
                                >
                                    Lupa Kata Sandi?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#D4B982] text-white font-bold py-4 rounded-xl transition duration-200 hover:bg-[#c4a972] active:scale-[0.98] shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    'Masuk'
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#1E4A7A] text-gray-300">Atau</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
                                >
                                    <img
                                        src="https://authjs.dev/img/providers/google.svg"
                                        alt="Google"
                                        className="h-5"
                                    />
                                    <span className="text-sm">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
                                >
                                    <img
                                        src="https://authjs.dev/img/providers/facebook.svg"
                                        alt="Facebook"
                                        className="h-5"
                                    />
                                    <span className="text-sm">Facebook</span>
                                </button>
                            </div>

                            {/* Register Link */}
                            <div className="text-center mt-6 text-sm text-white/80">
                                <p>
                                    Belum punya akun?{' '}
                                    <Link
                                        href="/register"
                                        className="font-bold hover:underline ml-1 text-white"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}