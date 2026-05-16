import React from 'react';
import { Head } from '@inertiajs/react';
import WelcomeLayout from '../Layouts/WelcomeLayout';
import ArticleCard from '@/Components/ArticleCards';
import PricingCard from '@/Components/PricingCards';
import TestimonialCard from '@/Components/TestimonialCards';
import HomeScreenImage1 from '../../../public/images/HomescreenImage1.png'
import { PageProps } from '@/types';

// disini ditambahkan PageProps untuk mengambil data auth dari database.
export default function Home({auth}: PageProps) {

    const placeholderText = "wiandiasidaiwdis daidwiand anwid dwadaowdoam aod oamw odam aowdoa oawdoa dmoawdo awomdo doawdaod mowa mdoa odmawo dwkadkapwda mwm dada daawds a omwadoa";

    return (
        <WelcomeLayout auth={auth}>
           <Head title="Home" />

            {/* =========================================
                SECTION 1: HERO
                ========================================= */}
            <section className="max-w-6xl mx-auto px-8 py-20 flex flex-col-reverse md:flex-row items-center gap-12 relative">
                {/* Kolom Kiri: Teks & Tombol */}
                <div className="flex-1 space-y-6 z-10">
                    <h1 className="text-6xl font-extrabold text-[#064e7b] tracking-tight">
                        Positive Future Generation
                    </h1>
                    <p className="text-[#064e7b] font-bold text-lg leading-relaxed max-w-md">
                        Membentuk generasi yang memiliki masa depan yang positif melalui pendidikan dan pengembangan diri.
                    </p>
                    <button onClick={() => {} } className="bg-[#cc9945] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#b58639] transition mt-4">
                        Daftar Sekarang
                    </button>
                </div>

                {/* Kolom Kanan: Gambar Lingkaran & Ornamen */}
                <div className="flex-1 relative flex justify-center items-center">
                    <div className="absolute -top-10 left-0 text-6xl text-[#064e7b] opacity-80">✦</div>
                    <div className="absolute top-0 left-12 text-4xl text-[#cc9945] opacity-80">✦</div>

                    <div className="w-[400px] h-[400px] rounded-full border-[12px] border-[#C8A756] bg-[#1D538F] flex items-center justify-center overflow-hidden z-10 shadow-lg relative">
                        <div className="text-gray-500 font-bold text-xl text-center px-4">
                            <img
                                src="/images/HomescreenImage1.png"
                                alt="Gambar Utama"
                                className="w-full h-96 object-cover mt-16"
                            />
                        </div>
                    </div>

                    <div className="absolute -bottom-10 left-10 text-4xl text-[#cc9945] opacity-80">✦</div>
                    <div className="absolute bottom-0 left-20 text-3xl text-[#064e7b] opacity-80">✦</div>

                    <div className="absolute -bottom-16 -right-8 z-0">
                        <div className="text-[#064e7b] text-8xl leading-none opacity-90 tracking-tighter">#</div>
                        <div className="text-[#cc9945] text-6xl leading-none opacity-90 tracking-tighter absolute top-8 -left-8">#</div>
                    </div>
                </div>
            </section>

            {/* =========================================
                SECTION 2: ABOUT US (Bagian Baru)
                ========================================= */}
            <section className="relative w-full py-24 mt-12 flex items-center justify-center">
                {/* Background Image dengan Overlay Gelap
                */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/images/HomescreenImage2.png')" }}
                ></div>
                {/* Overlay warna hitam/abu-abu transparan agar teks emas terbaca */}
                <div className="absolute inset-0 bg-gray-900/80 z-0"></div>

                {/* Konten Utama About Us */}
                <div className="relative z-10 max-w-3xl mx-auto px-8 flex flex-col items-center text-center">

                    {/* Judul */}
                    <h2 className="text-5xl font-bold text-[#d4af37] mb-6">
                        About Us
                    </h2>

                    {/* Placeholder Logo / Icon */}
                    <div className="text-[#d4af37] text-4xl mb-6 flex flex-col items-center justify-center">
                        {/* Placeholder Bintang Kecil */}

                        {/* Area untuk Logo SVG/Gambar */}
                        <div className="w-32 h-60 border-[#d4af37] flex items-center justify-center rounded-lg">
                            <img
                                src="/images/PFGLogoHD.png"
                                alt="Gambar Utama"
                                className="w-full object-cover h-40"
                            />
                        </div>
                    </div>

                    {/* Teks Paragraf */}
                    <p className="text-[#d4af37] font-semibold text-lg md:text-xl leading-relaxed">
                        wiandiasidaiwdis daidwiand anwid dwadaowdoam aod oamw odam
                        aowdoa oawdoa dmoawdo awomdo doawdaod mowa mdoa odmawo
                        dwkadkapwda mwm omwadoa
                    </p>
                </div>
            </section>

            {/* =========================================
                SECTION 3: TESTIMONI
                ========================================= */}
           {/* =========================================
                SECTION 3: TESTIMONI
                ========================================= */}
            <section className="py-20 px-8 mx-auto overflow-hidden">
                <h2 className="text-4xl md:text-5xl font-bold text-[#064e7b] text-center mb-16 leading-tight">
                    Mereka Bisa Sukses<br/>Dan Kamu Juga
                </h2>

                {/* Container Utama:
                    'group' digunakan agar kita bisa mendeteksi hover.
                */}
                <div className="flex overflow-hidden w-full group">

                    {/* --- KELOMPOK 1 ---
                        Ditambah class 'group-hover:[animation-play-state:paused]'
                        agar animasi BERHENTI saat user menaruh kursor di atas card untuk membaca.
                    */}
                    <div className="flex shrink-0 gap-6 pr-6 animate-marquee group-hover:[animation-play-state:paused]">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <TestimonialCard key={item} name={`User ${item}`} text={placeholderText} />
                        ))}
                    </div>

                    {/* --- KELOMPOK 2 (DUPLIKAT) ---
                        Ini adalah kunci rahasianya. Kita render ulang data yang SAMA PERSIS
                        agar saat kelompok 1 habis, kelompok 2 langsung menyambung tanpa jeda.
                    */}
                    <div className="flex shrink-0 gap-6 pr-6 animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <TestimonialCard key={`dup-${item}`} name={`User ${item}`} text={placeholderText} />
                        ))}
                    </div>

                </div>
            </section>

            {/* =========================================
                SECTION 4: PRICING (PROMO)
                ========================================= */}
            <section className="py-20 px-8 bg-[#f4f4f5]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16 leading-tight">
                        Berani Mulai Untuk Jadi Hebat<br/>Dengan Promo Dari Kami
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <PricingCard
                            title="Single"
                            subtitle="Cocok untuk entrepreneur"
                            originalPrice="Rp 89.900"
                            price="12.900"
                            discount="86%"
                            features={[
                                "<b>Buat 1 website</b>",
                                "<span className='text-gray-400'>Tanpa aplikasi web Managed Node.js</span>",
                                "<b>10 GB</b> SSD storage untuk menyimpan file",
                                "<b>1 mailbox per website, gratis 1 tahun</b>"
                            ]}
                        />
                        <PricingCard
                            title="Premium"
                            subtitle="Segala yang dibutuhkan untuk buat website"
                            originalPrice="Rp 119.900"
                            price="23.900"
                            discount="80%"
                            isPopular={true}
                            features={[
                                "<b>Buat hingga 3 website</b>",
                                "<span className='text-gray-400'>Tanpa aplikasi web Managed Node.js</span>",
                                "<b>20 GB</b> SSD storage untuk menyimpan file",
                                "<b>2 mailbox per website, gratis 1 tahun</b>"
                            ]}
                        />
                        <PricingCard
                            title="Business"
                            subtitle="Lebih banyak tool dan resource untuk berkembang"
                            originalPrice="Rp 129.900"
                            price="38.900"
                            discount="70%"
                            features={[
                                "<b>Buat hingga 50 website</b>",
                                "<b>5 aplikasi web Managed Node.js</b> <span class='bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded ml-1'>BARU</span>",
                                "<b>50 GB</b> NVMe storage tercepat di dunia",
                                "<b>5 mailbox per website, gratis 1 tahun</b>"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* =========================================
                SECTION 5: NEWS / ARTIKEL
                ========================================= */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                    Berita Dan Artikel Terbaru Dari Kami
                </h2>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                    {[1, 2, 3, 4].map((item) => (
                        <div className="snap-center" key={item}>
                            <ArticleCard
                                title="Bencana Per Tanggal XX/XX"
                                text={placeholderText}
                                imageUrl="https://via.placeholder.com/400x200?text=Berita"
                            />
                        </div>
                    ))}
                </div>
            </section>

        </WelcomeLayout>
    );
}
