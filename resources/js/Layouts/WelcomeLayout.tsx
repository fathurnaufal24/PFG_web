import { Link } from '@inertiajs/react';
import React, { PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

// PropsWithChildren type aku ganti ke PageProps untuk meng-handle auth.
// before:
// export default function WelcomeLayout({ children }: PropsWithChildren) {
// after:
export default function WelcomeLayout({ auth, children }: PageProps<{ children?: ReactNode }>) {
    return (
        <div className=" min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="w-full bg-[#064e7b] px-8 py-5 flex items-center justify-between">
                {/* Area Logo (Kosong di desain, tapi disiapkan ruangnya) */}
                <div className="w-32">
                    <img
                        src="/images/PFGLogoWIthTextHD.png"
                        alt="Gambar Utama"
                        className="w-full object-cover mt-16"
                    />
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-8 text-[#d4af37] font-bold text-xl">
                    <Link href="#" className="hover:text-white transition">Home</Link>
                    <Link href="#" className="hover:text-white transition">About</Link>
                    <Link href="#" className="hover:text-white transition">Testimoni</Link>
                    <Link href="#" className="hover:text-white transition">Layanan</Link>
                    <Link href="#" className="hover:text-white transition">Artikel</Link>
                </div>

                {/* Auth Buttons */}

                <div>
                    {
                        // cek auth. if authenticated, show this button.
                        (auth.user) ?
                            <Link href="/dashboard" className="bg-[#cc9945] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b58639] transition">
                                Dashboard
                            </Link> : // otherwise, show these buttons.
                            <div className="flex space-x-4">
                                <Link href="/login" className="bg-white text-[#d4af37] px-6 py-2 rounded-xl font-bold text-sm border-4 border-transparent hover:border-[#d4af37] transition">
                                    Sign In
                                </Link>
                                <Link href="/register" className="bg-[#cc9945] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b58639] transition">
                                    Daftar
                                </Link>
                            </div>
                    }
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            <footer className="bg-[#064e7b] text-white pt-16 pb-8 px-8 border-t-4 border-[#064e7b]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">

                    {/* Kiri: Logo & Pembayaran */}
                    <div className="space-y-6 max-w-md">
                        <div className="text-[#d4af37] text-3xl font-extrabold flex items-center gap-2">
                            <span>✦</span> PFG
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {/* Placeholder Icon Pembayaran */}
                            {['VISA', 'MasterCard', 'AMEX', 'DISCOVER', 'JCB', 'Diners'].map((cc) => (
                                <div key={cc} className="bg-white text-blue-900 text-xs font-bold px-2 py-1 rounded">
                                    {cc}
                                </div>
                            ))}
                            <span className="text-xs self-center">dan lainnya</span>
                        </div>
                        <p className="text-sm text-blue-200 mt-8">
                            © 2004-2026 Hostinger. Mulai sukses online dengan bantuan AI yang beri Anda kontrol penuh.
                        </p>
                    </div>

                    {/* Kanan: Links & Social */}
                    <div className="flex flex-col md:items-end space-y-8">
                        {/* Placeholder Social Icons */}
                        <div className="flex gap-4">
                            {['in', 'f', 'ig', 'x', 'yt', 'tt'].map((soc) => (
                                <div key={soc} className="w-8 h-8 bg-gray-900/50 rounded flex items-center justify-center text-xs">
                                    {soc}
                                </div>
                            ))}
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-blue-200">
                            <a href="#" className="hover:text-white">Ketentuan permintaan NPRD</a>
                            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-white">Kebijakan Pengembalian Uang</a>
                            <a href="#" className="hover:text-white">Ketentuan Penggunaan</a>
                        </div>

                        <p className="text-xs text-blue-200 mt-4">
                            Harga belum termasuk PPN
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
