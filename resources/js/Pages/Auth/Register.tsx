import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Jika kamu menggunakan file Welcome.jsx, ganti 'Welcome' dengan 'Login'
export default function Register(){
    // Form handling dengan Inertia.js
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        // name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: "student",
        remember: false,
    });

    const [selectedRole, setSelectedRole] = useState("siswa"); // Login berdasarkan role, Default ke siswa

    const canResetPassword = true; //placehorlder saja


    // Fungsi submit
    const submit = (e :FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Data Diisi', data);
        post('/register', {
            onError: (errors) => {console.log('ada yang error: ', errors)},
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk Ke Akun Belajar Anda" />

            <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
                <div className="w-full flex bg-white shadow-lg overflow-hidden min-h-[600px]">

                    {/* Bagian Kiri (Kosong untuk Gambar) */}
                    <div className="w-1/2 flex items-center justify-center p-8 bg-[#D6D6D6]">
                        {/* Bagian ini akan diisi dengan gambar nanti.
                          Pastikan ukurannya optimal (misalnya 1024x768).
                        */}
                    </div>

                    {/* Bagian Kanan (Form Login) */}
                    <div className="w-1/2 bg-white p-12 text-white">

                        {/* Tombol Siswa/Guru */}
                        <div className="flex justify-center mb-10">
                            <button onClick={ () => setData('role', "student")} className={`px-6 py-2 ${data.role === "student" ? "bg-[#D1AE5A]" : "bg-[#1D538F]"} text-[#e3e3e3] font-semibold rounded-l-xl text-md min-w-60 min-h-16 hover:outline-2 `}>
                                Siswa
                            </button>
                            <button onClick={ () => setData('role', "teacher")} className={`px-6 py-2 ${data.role === "teacher" ? "bg-[#D1AE5A]" : "bg-[#1D538F]"} text-[#e3e3e3] font-semibold rounded-r-xl text-md min-w-60 min-h-16`}>
                                Guru
                            </button>
                        </div>

                        <form onSubmit={submit} className="flex flex-col items-center">

                            {/* Judul */}
                            <div className='bg-[#1D538F] w-full p-10 rounded-xl mb-10'>
                                    <h2 className="text-2xl font-bold mb-10 tracking-tight text-center text-white">
                                    Yuk Daftar, Biar Bisa Mulai Belajar
                                </h2 >

                                {/* first_name */}
                                <div className="w-full mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="Nama"
                                        className="w-full px-5 py-3 rounded-lg border-2 border-transparent focus:border-[#D1AE5A] focus:ring-0 text-gray-800 placeholder:text-gray-400"
                                        required
                                    />
                                    {errors.first_name && <div className="text-red-300 text-xs mt-1">{errors.first_name}</div>}
                                </div>

                                {/* Input Email/No HP */}
                                <div className="w-full mb-3">
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Nomor HP atau Email"
                                        className="w-full px-5 py-3 rounded-lg border-2 border-transparent focus:border-[#D1AE5A] focus:ring-0 text-gray-800 placeholder:text-gray-400"
                                        required
                                    />
                                    {errors.email && <div className="text-red-300 text-xs mt-1">{errors.email}</div>}
                                </div>


                                {/* Input Kata Sandi */}
                                <div className="w-full mb-3">
                                    <input
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kata Sandi"
                                        className="w-full px-5 py-3 rounded-lg border-2 border-transparent focus:border-[#D1AE5A] focus:ring-0 text-gray-800 placeholder:text-gray-400"
                                        required
                                    />
                                    {errors.password && <div className="text-red-300 text-xs mt-1">{errors.password}</div>}
                                </div>

                                {/* Ulangi input kata sandi */}
                                <div className="w-full mb-3">
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Konfirmasi Kata Sandi"
                                        className="w-full px-5 py-3 rounded-lg border-2 border-transparent focus:border-[#D1AE5A] focus:ring-0 text-gray-800 placeholder:text-gray-400"
                                        required
                                    />
                                    {errors.password_confirmation && <div className="text-red-300 text-xs mt-1">{errors.password_confirmation}</div>}
                                </div>

                                {/* Lupa Kata Sandi */}
                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password" // Ini rute boilerplate Laravel Breeze
                                        className="text-sm mb-8 text-[#A6BCD0] hover:text-white"
                                    >
                                        Lupa Kata Sandi?
                                    </Link>
                                )}

                                {/* Tombol Masuk */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-[#D1AE5A] text-[#7A643B] font-bold rounded-lg mb-8 hover:bg-[#E3BE63] transition duration-150 disabled:opacity-50"
                                >
                                    {processing ? 'Memproses...' : 'Daftar'}
                                </button>

                                {/* Pembatas Atau */}
                                <div className="w-full flex items-center mb-8">
                                    <div className="flex-1 h-px bg-[#7289AB]"></div>
                                    <span className="mx-4 text-sm text-[#A6BCD0]">Atau</span>
                                    <div className="flex-1 h-px bg-[#7289AB]"></div>
                                </div>

                                {/* Tombol Social Login */}
                                <div className="w-full flex gap-3">
                                    {/* Google */}
                                    <button type="button" className="flex-1 flex items-center justify-center gap-3 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                                        <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="h-5" />
                                        Google
                                    </button>
                                    {/* Facebook */}
                                    <button type="button" className="flex-1 flex items-center justify-center gap-3 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                                        <img src="https://authjs.dev/img/providers/facebook.svg" alt="Facebook" className="h-5" />
                                        Facebook
                                    </button>
                                </div>

                                {/* Daftar Sekarang */}
                                <div className="text-center mt-12 text-[#A6BCD0]">
                                    Sudah punya akun? <Link href="/login" className="text-white hover:underline">Masuk Sekarang</Link>
                                </div>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}
